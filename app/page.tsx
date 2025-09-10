"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Folder, File, ArrowLeft, ChevronRight, Upload, Download, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import WelcomeScreen from "@/components/WelcomeScreen";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type FileType = {
  Key: string;
  FullKey: string;
  Size: number;
  LastModified: string;
};

type ApiResponse = {
  files: FileType[];
  folders: string[];
};

function getBreadcrumbs(prefix: string) {
  if (!prefix) return ["EB-root-s3"];
  const parts = prefix.replace(/\/$/, "").split("/");
  return ["EB-root-s3", ...parts.filter(Boolean)];
}

function HomeContent() {
  const [data, setData] = useState<ApiResponse>({ files: [], folders: [] });
  const [prefix, setPrefix] = useState<string>("");
  const { permissions, role } = useRole();

  // Don't render if no role or permissions
  if (!role || !permissions) {
    return null;
  }

  useEffect(() => {
    const url = prefix
      ? `${apiUrl}/api/objects?prefix=${encodeURIComponent(prefix)}`
      : `${apiUrl}/api/objects`;
    fetch(url)
      .then((res) => res.json())
      .then(setData);
  }, [prefix]);

  const breadcrumbs = getBreadcrumbs(prefix);

  // Helper to go up one directory
  function goUpDir() {
    if (!prefix) return;
    const parts = prefix.replace(/\/$/, "").split("/");
    parts.pop();
    const newPrefix = parts.length ? parts.join("/") + "/" : "";
    setPrefix(newPrefix);
  }

  return (
    <div className="min-h-screen w-full transition-colors bg-white text-black dark:bg-black dark:text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
        <div className="rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 bg-white dark:bg-black text-black dark:text-white">
          <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-8">
              {/* Header with Path Navigation, Back, and Action Buttons */}
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                {/* Left Section: Back + Path Breadcrumb + Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  {prefix && (
                    <button
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-white 
                        bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 
                        transition-all"
                      onClick={goUpDir}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  )}

                  <Folder className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <nav className="flex items-center gap-1 text-sm flex-wrap">
                    {breadcrumbs.map((crumb, idx) => (
                      <span key={idx} className="flex items-center">
                        {idx > 0 && <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-300 mx-1" />}
                        <button
                          onClick={() => {
                            if (idx === 0) setPrefix("");
                            else {
                              const newPrefix = breadcrumbs.slice(1, idx + 1).join("/") + "/";
                              setPrefix(newPrefix);
                            }
                          }}
                          className={`px-2 py-1 rounded-md transition-all ${
                            idx === breadcrumbs.length - 1
                              ? "font-bold text-blue-600 dark:text-blue-400"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-white"
                          }`}
                        >
                          {crumb}
                        </button>
                      </span>
                    ))}
                  </nav>
                  {/* Create Folder Button */}
                  {permissions.canCreateFolder && (
                  <button
                      onClick={async () => {
                      const folderName = prompt('Enter folder name:');
                      if (folderName) {
                          try {
                            const folderKey = prefix + folderName + "/";
                            const response = await fetch(
                              `${apiUrl}/api/create-folder?key=${encodeURIComponent(folderKey)}`,
                              { method: 'POST' }
                            );
                            
                            if (response.ok) {
                              const listResponse = await fetch(
                                prefix
                                  ? `${apiUrl}/api/objects?prefix=${encodeURIComponent(prefix)}`
                                  : `${apiUrl}/api/objects`
                              );
                              const newData = await listResponse.json();
                              setData(newData);
                            } else {
                              const error = await response.json();
                              alert(`Failed to create folder: ${error.error || 'Unknown error'}`);
                            }
                          } catch (error) {
                            console.error("Error creating folder:", error);
                            alert("Failed to create folder. Please try again.");
                          }
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
                      bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 
                      text-slate-800 dark:text-white rounded-lg transition-colors ml-2"
                  >
                    <Folder className="w-4 h-4" />
                    New Folder
                  </button>
                  )}
                  {/* Upload File Button */}
                  {permissions.canUpload && (
                  <button
                    onClick={() => document.getElementById('upload-to-current')?.click()}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
                      bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                      transition-colors ml-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload File
                  </button>
                  )}
                  {/* Admin User Management Button */}
                  {permissions.canManageUsers && (
                    <button
                      onClick={() => {
                        alert('User management feature coming soon!');
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
                        bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                        transition-colors ml-2"
                    >
                      <Users className="w-4 h-4" />
                      Manage Users
                    </button>
                  )}
                  <input
                    type="file"
                    id="upload-to-current"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const response = await fetch(
                          `${apiUrl}/api/upload?key=${encodeURIComponent(prefix + file.name)}`
                        );
                        const { url } = await response.json();
                        await fetch(url, {
                          method: "PUT",
                          body: file,
                          headers: {
                            "Content-Type": file.type,
                          },
                        });
                        const listResponse = await fetch(
                          prefix
                            ? `${apiUrl}/api/objects?prefix=${encodeURIComponent(prefix)}`
                            : `${apiUrl}/api/objects`
                        );
                        const newData = await listResponse.json();
                        setData(newData);
                      } catch (error) {
                        console.error("Error uploading file:", error);
                        alert("Failed to upload file. Please try again.");
                      }
                    }}
                  />
                </div>
              </div>

              {/* Files and Folders List */}
              <ul className="divide-y divide-slate-200/50 dark:divide-white/10">
                {/* Show message if no content */}
                {data.folders.length === 0 && data.files.length === 0 && (
                  <li className="text-slate-500 dark:text-slate-200 py-8 text-center bg-slate-50/30 dark:bg-slate-800/40 rounded-lg">
                    No items found
                  </li>
                )}

                {/* Folders */}
                {data.folders.map((folder) => (
                  <li key={folder} 
                      className="flex items-center justify-between py-4 px-4 
                        hover:bg-slate-100/50 dark:hover:bg-slate-800/40 rounded-xl transition-all duration-300 
                        cursor-pointer group"
                  >
                    <div
                      onClick={() => setPrefix(folder)}
                      className="flex items-center gap-3 flex-1"
                    >
                      <Folder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-slate-800 dark:text-white tracking-wide">
                        {folder.replace(prefix, "").replace("/", "")}
                      </span>
                    </div>
                    {permissions.canDelete && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete the folder "${folder.replace(prefix, "").replace("/", "")}"? This will delete all contents inside.`)) {
                            try {
                              const response = await fetch(
                                `${apiUrl}/api/delete-folder?key=${encodeURIComponent(folder)}`,
                                { method: 'DELETE' }
                              );
                              
                              if (response.ok) {
                                const listResponse = await fetch(
                                  prefix
                                    ? `${apiUrl}/api/objects?prefix=${encodeURIComponent(prefix)}`
                                    : `${apiUrl}/api/objects`
                                );
                                const newData = await listResponse.json();
                                setData(newData);
                              } else {
                                const error = await response.json();
                                alert(`Failed to delete folder: ${error.error || 'Unknown error'}`);
                              }
                            } catch (error) {
                              console.error("Error deleting folder:", error);
                              alert("Failed to delete folder. Please try again.");
                            }
                          }
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 
                          bg-red-50 dark:bg-red-900/30 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-all ml-4"
                        title="Delete Folder"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </li>
                ))}

                {/* Files */}
                {data.files.map((file) => (
                  <li key={file.Key} 
                      className="flex items-center justify-between py-4 px-4 
                        hover:bg-slate-100/50 dark:hover:bg-slate-800/40 rounded-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <File className="w-5 h-5 text-slate-500 dark:text-slate-200 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-white tracking-wide truncate">
                          {prefix ? file.Key.replace(prefix, "") : file.Key}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                          {(file.Size / 1024).toFixed(1)} KB • {new Date(file.LastModified).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {permissions.canView && (
                        <button
                          onClick={() => {
                            const viewUrl = `${apiUrl}/api/view?key=${encodeURIComponent(file.FullKey)}`;
                            window.open(viewUrl, '_blank');
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-white 
                            bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                          title="View"
                        >
                          View
                        </button>
                      )}
                      {permissions.canDownload && (
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch(
                                `${apiUrl}/api/download?key=${encodeURIComponent(file.FullKey)}&disposition=attachment&filename=${encodeURIComponent(file.Key.split('/').pop() || 'download')}`
                              );
                              const { url } = await response.json();
                              
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = file.Key.split('/').pop() || 'download';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            } catch (error) {
                              console.error("Error downloading file:", error);
                              alert("Failed to download file. Please try again.");
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 
                            bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      )}
                      {permissions.canDelete && (
                        <button
                          onClick={async () => {
                            if (confirm(`Are you sure you want to delete "${file.Key.split('/').pop()}"?`)) {
                              try {
                                const response = await fetch(
                                  `${apiUrl}/api/delete?key=${encodeURIComponent(file.FullKey)}`,
                                  { method: 'DELETE' }
                                );
                                
                                if (response.ok) {
                                  const listResponse = await fetch(
                                    prefix
                                      ? `${apiUrl}/api/objects?prefix=${encodeURIComponent(prefix)}`
                                      : `${apiUrl}/api/objects`
                                  );
                                  const newData = await listResponse.json();
                                  setData(newData);
                                } else {
                                  const error = await response.json();
                                  alert(`Failed to delete file: ${error.error || 'Unknown error'}`);
                                }
                              } catch (error) {
                                console.error("Error deleting file:", error);
                                alert("Failed to delete file. Please try again.");
                              }
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 
                            bg-red-50 dark:bg-red-900/30 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Guest Message */}
      {role === 'guest' && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="backdrop-blur-md bg-blue-50/80 dark:bg-blue-900/20 rounded-xl shadow-lg border border-blue-200/50 dark:border-blue-700/50 p-6">
              <p className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                You're viewing as Guest! 
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-300 mb-2">
                For full access, request admin privileges or sign in as a user 💙
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If user has a role, show the main content
  if (role && !isLoading) {
    return <HomeContent />;
  }

  // Show welcome screen for new users or when no role is set
  return <WelcomeScreen />;
}
