"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/Card";
import { Key, Copy, Trash2, Plus, AlertCircle } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export default function ApiKeysSection() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/api-keys");
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.apiKeys || []);
      }
    } catch (error) {
      console.error("Failed to fetch API keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    if (!newKeyName.trim()) {
      setError("Please enter a name for the API key");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeys([data.apiKey, ...apiKeys]);
        setNewKeyName("");
        setShowNewKeyDialog(false);
        // Auto-copy the new key
        copyToClipboard(data.apiKey.key);
      } else {
        setError("Failed to generate API key");
      }
    } catch (error) {
      console.error("Failed to generate API key:", error);
      setError("An error occurred while generating the API key");
    } finally {
      setGenerating(false);
    }
  };

  const deleteApiKey = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this API key? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/api-keys?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setApiKeys(apiKeys.filter((key) => key.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete API key:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskApiKey = (key: string) => {
    return `${key.substring(0, 12)}${"•".repeat(20)}${key.substring(
      key.length - 8
    )}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            API Keys
          </div>
          <button
            onClick={() => setShowNewKeyDialog(true)}
            className="inline-flex cursor-pointer items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Key
          </button>
        </CardTitle>
        <CardDescription>
          Manage API keys for GitHub Action and CLI integrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Use API keys to authenticate requests from the GitHub Action or CLI
            tool. Keep your keys secure and never commit them to version
            control.
          </p>

          {/* New Key Dialog */}
          {showNewKeyDialog && (
            <div className="p-4 rounded-lg border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Generate New API Key
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production CI, Local Development"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                {error && (
                  <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {error}
                  </div>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={generateApiKey}
                    disabled={generating}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {generating ? "Generating..." : "Generate"}
                  </button>
                  <button
                    onClick={() => {
                      setShowNewKeyDialog(false);
                      setNewKeyName("");
                      setError(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* API Keys List */}
          {loading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Loading API keys...
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No API keys yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Click &quot;New Key&quot; to generate your first API key
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white mb-1">
                      {apiKey.name}
                    </p>
                    <p className="text-sm font-mono text-gray-600 dark:text-gray-400 truncate">
                      {maskApiKey(apiKey.key)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Created {new Date(apiKey.createdAt).toLocaleDateString()}
                      {apiKey.lastUsedAt && (
                        <>
                          {" "}
                          • Last used{" "}
                          {new Date(apiKey.lastUsedAt).toLocaleDateString()}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedKey === apiKey.key ? (
                        <span className="text-sm text-green-600 dark:text-green-400">
                          Copied!
                        </span>
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteApiKey(apiKey.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Delete key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Usage Instructions */}
          {apiKeys.length > 0 && (
            <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                How to use your API key
              </h4>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <p>
                  <strong>GitHub Action:</strong> Add as a repository secret
                  named{" "}
                  <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">
                    DASHBOARD_API_KEY
                  </code>
                </p>
                <p>
                  <strong>CLI:</strong> Set as environment variable{" "}
                  <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">
                    GREENLIGHTCI_API_KEY
                  </code>
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
