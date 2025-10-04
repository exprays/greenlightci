import Link from 'next/link';
import {
  CheckCircle2,
  TrendingUp,
  Zap,
  Shield,
  Github,
  Terminal,
  BarChart3,
  Eye,
  Code,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">GL</span>
              </div>
              <span className="text-xl font-bold gradient-text">
                GreenLightCI
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="https://github.com/exprays/greenlightci"
                target="_blank"
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="/api/auth/signin/github?callbackUrl=/dashboard"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Github className="w-4 h-4 mr-2" />
                Sign in with GitHub
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            Baseline Tooling Hackathon Project
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Ship Web Features with
            <span className="block gradient-text">Confidence</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
            Automatically check Baseline web feature compatibility in your PRs.
            Track adoption trends, catch breaking changes early, and ensure your
            code works across all modern browsers.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/api/auth/signin/github?callbackUrl=/dashboard"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Github className="w-5 h-5 mr-2" />
              Get Started Free
            </Link>
            <Link
              href="https://github.com/exprays/greenlightci"
              target="_blank"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              <Code className="w-5 h-5 mr-2" />
              View on GitHub
            </Link>
          </div>
        </div>

        {/* Hero Image/Demo */}
        <div className="mt-16">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-8 text-white">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="font-mono text-sm space-y-2">
                <div className="flex items-center">
                  <span className="text-purple-200">$</span>
                  <span className="ml-2">greenlightci check</span>
                </div>
                <div className="text-purple-100">
                  ✓ Found 2 files with web features
                </div>
                <div className="mt-4">
                  <div className="text-purple-100">styles.css [91/100]</div>
                  <div className="ml-4 text-purple-200">
                    ✓ CSS Grid - Widely Available
                  </div>
                  <div className="ml-4 text-yellow-300">
                    ⚠ Container Queries - Newly Available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need to ship with confidence
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Comprehensive tooling for Baseline web feature compatibility
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              GitHub Action
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Automatic compatibility checks on every PR. Get instant feedback
              with detailed comments showing which features are safe to use.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              CLI Tool
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check compatibility locally during development. Watch mode for
              real-time feedback as you code.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Dashboard Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track Baseline adoption trends over time. Visualize compatibility
              scores and feature usage across your projects.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Smart Suggestions
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get polyfill recommendations for features with limited support.
              Know exactly what to add for better compatibility.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Watch Mode
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Continuous monitoring of your files. Get instant feedback as you
              develop without manual checks.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Configurable Rules
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Set custom blocking rules for your team. Choose target years and
              strictness levels that match your requirements.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How it works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Get started in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Install the GitHub Action
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add GreenLightCI to your workflow file. It takes less than 2
              minutes to set up.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Open a Pull Request
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Make changes to your code. The action automatically detects web
              features in your diff.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Get Instant Feedback
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Receive detailed comments showing compatibility status and
              recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to ship with confidence?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join developers using GreenLightCI to ensure web feature
            compatibility across all modern browsers.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/api/auth/signin/github?callbackUrl=/dashboard"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-purple-600 bg-white rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
            >
              <Github className="w-5 h-5 mr-2" />
              Sign in with GitHub
            </Link>
            <Link
              href="https://github.com/exprays/greenlightci/blob/main/README.md"
              target="_blank"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">GL</span>
              </div>
              <span className="text-xl font-bold gradient-text">
                GreenLightCI
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <Link
                href="https://github.com/exprays/greenlightci"
                target="_blank"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                GitHub
              </Link>
              <Link
                href="https://github.com/exprays/greenlightci/blob/main/README.md"
                target="_blank"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Documentation
              </Link>
              <Link
                href="https://github.com/exprays/greenlightci/issues"
                target="_blank"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Issues
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-500">
            <p>
              Built for the Baseline Tooling Hackathon · Made with ❤️ by the
              community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
