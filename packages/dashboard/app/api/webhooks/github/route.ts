import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { prisma } from '@/lib/db';

/**
 * POST /api/webhooks/github
 * Handle GitHub webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Verify GitHub signature
    const signature = request.headers.get('x-hub-signature-256');
    const event = request.headers.get('x-github-event');
    
    if (!signature || !event) {
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    const body = await request.text();
    const payload = JSON.parse(body);

    // Verify webhook signature
    if (process.env.GITHUB_WEBHOOK_SECRET) {
      const expectedSignature = `sha256=${createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
        .update(body)
        .digest('hex')}`;

      if (signature !== expectedSignature) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // Handle different webhook events
    switch (event) {
      case 'push':
        await handlePushEvent(payload);
        break;
      case 'pull_request':
        await handlePullRequestEvent(payload);
        break;
      case 'workflow_run':
        await handleWorkflowRunEvent(payload);
        break;
      default:
        console.log(`Unhandled event type: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle push events
 */
async function handlePushEvent(payload: any) {
  const { repository, sender, ref, commits } = payload;

  // Only handle pushes to main/master branch
  if (!ref.includes('main') && !ref.includes('master')) {
    return;
  }

  // Find or create project
  const [owner, repo] = repository.full_name.split('/');
  
  let project = await prisma.project.findUnique({
    where: {
      owner_repo: { owner, repo },
    },
  });

  if (!project) {
    project = await prisma.project.create({
      data: {
        name: repository.name,
        owner,
        repo,
        url: repository.html_url,
        description: repository.description || `Automated tracking for ${repository.name}`,
        userId: 'system',
      },
    });
  }

  // Update project metadata
  await prisma.project.update({
    where: { id: project.id },
    data: {
      updatedAt: new Date(),
    },
  });

  console.log(`Processed push event for ${repository.full_name}`);
}

/**
 * Handle pull request events
 */
async function handlePullRequestEvent(payload: any) {
  const { action, pull_request, repository } = payload;

  // Only handle opened and synchronized (updated) PRs
  if (action !== 'opened' && action !== 'synchronize') {
    return;
  }

  const [owner, repo] = repository.full_name.split('/');

  // Find or create project
  let project = await prisma.project.findUnique({
    where: {
      owner_repo: { owner, repo },
    },
  });

  if (!project) {
    project = await prisma.project.create({
      data: {
        name: repository.name,
        owner,
        repo,
        url: repository.html_url,
        description: repository.description || `Automated tracking for ${repository.name}`,
        userId: 'system',
      },
    });
  }

  console.log(`Processed PR #${pull_request.number} for ${repository.full_name}`);
}

/**
 * Handle workflow run events (when GreenLightCI action completes)
 */
async function handleWorkflowRunEvent(payload: any) {
  const { workflow_run, repository } = payload;

  // Only handle completed workflow runs
  if (workflow_run.status !== 'completed') {
    return;
  }

  // Check if this is a GreenLightCI workflow
  const isGreenLightWorkflow =
    workflow_run.name.toLowerCase().includes('greenlightci') ||
    workflow_run.name.toLowerCase().includes('baseline');

  if (!isGreenLightWorkflow) {
    return;
  }

  const [owner, repo] = repository.full_name.split('/');

  // Find project
  const project = await prisma.project.findUnique({
    where: {
      owner_repo: { owner, repo },
    },
  });

  if (project) {
    // Update project's last scan time
    await prisma.project.update({
      where: { id: project.id },
      data: {
        updatedAt: new Date(),
      },
    });
  }

  console.log(`Processed workflow run for ${repository.full_name}: ${workflow_run.conclusion}`);
}

/**
 * GET /api/webhooks/github
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'GitHub webhook endpoint is active',
  });
}
