"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOrganization } from "../contexts/OrganizationContext";
import { userAPI } from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: userLoading, refreshUser } = useOrganization();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deletePhotoLoading, setDeletePhotoLoading] = useState(false);
  const [deletePhotoError, setDeletePhotoError] = useState<string | null>(null);
  const [uploadPhotoLoading, setUploadPhotoLoading] = useState(false);
  const [uploadPhotoError, setUploadPhotoError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (updateSuccess) {
      const timeout = setTimeout(() => setUpdateSuccess(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [updateSuccess]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(false);

    if (!name.trim()) {
      setUpdateError("Name is required");
      return;
    }

    setUpdateLoading(true);
    try {
      // TODO: Implement API endpoint for updating user profile
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await refreshUser();
      setUpdateSuccess(true);
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!user?.id) return;

    setDeletePhotoError(null);
    setDeletePhotoLoading(true);

    try {
      await userAPI.deleteProfilePicture(user.id);
      await refreshUser();
    } catch (error) {
      setDeletePhotoError(
        error instanceof Error
          ? error.message
          : "Failed to delete profile picture",
      );
    } finally {
      setDeletePhotoLoading(false);
    }
  };

  const handleUploadPhoto = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!user?.id) return;

    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadPhotoError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadPhotoError("Image must be smaller than 5MB");
      return;
    }

    setUploadPhotoError(null);
    setUploadPhotoLoading(true);

    try {
      await userAPI.uploadProfilePicture(user.id, file);
      await refreshUser();
    } catch (error) {
      setUploadPhotoError(
        error instanceof Error
          ? error.message
          : "Failed to upload profile picture",
      );
    } finally {
      setUploadPhotoLoading(false);
      // Reset the input so the same file can be selected again
      event.target.value = "";
    }
  };

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--page-bg) text-(--text-primary)">
        <div className="text-center">
          <div className="text-2xl font-semibold">Loading...</div>
          <p className="mt-2 text-sm text-(--text-muted)">
            Checking authentication
          </p>
        </div>
      </div>
    );
  }

  // Return null while redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--page-bg) font-mono text-(--text-primary)">
      <Header />

      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(47,95,153,0.18),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(35,116,74,0.14),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.1),transparent)]" />

        <section className="px-4 py-12">
          <div className="mx-auto max-w-4xl space-y-8">
            <div>
              <h1 className="text-4xl font-bold md:text-5xl">Profile</h1>
              <p className="mt-2 text-lg text-(--text-secondary)">
                Manage your account information and credentials
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <Card className="rounded-2xl bg-(--surface-bg)/90 p-6 shadow-sm">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-lg font-semibold">
                    Account Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <Label className="text-sm text-(--text-secondary)">
                        Profile Picture
                      </Label>
                      <div className="mt-2 flex items-center gap-4">
                        {user.profile_picture ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.profile_picture}
                            alt={user.name || "User profile"}
                            className="h-16 w-16 rounded-full border-2 border-(--border-color)"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-(--accent-bg) flex items-center justify-center border-2 border-(--border-color)">
                            <span className="text-xl font-semibold text-accent">
                              {(user.name || user.email)
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadPhoto}
                            disabled={uploadPhotoLoading || deletePhotoLoading}
                            className="hidden"
                            id="profile-picture-input"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            disabled={uploadPhotoLoading || deletePhotoLoading}
                            className="text-sm"
                            onClick={() => {
                              document
                                .getElementById("profile-picture-input")
                                ?.click();
                            }}
                          >
                            {uploadPhotoLoading
                              ? "Uploading..."
                              : user.profile_picture
                                ? "Change Photo"
                                : "Upload Photo"}
                          </Button>
                          {user.profile_picture && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleDeletePhoto}
                              disabled={
                                deletePhotoLoading || uploadPhotoLoading
                              }
                              className="text-sm border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              {deletePhotoLoading ? "Deleting..." : "Delete"}
                            </Button>
                          )}
                        </div>
                      </div>
                      {(deletePhotoError || uploadPhotoError) && (
                        <p className="mt-2 text-xs text-(--error)">
                          {deletePhotoError || uploadPhotoError}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-(--text-muted)">
                        Accepted formats: JPG, PNG, GIF (max 5MB)
                      </p>
                    </div>

                    <div>
                      <Label
                        htmlFor="name"
                        className="text-sm text-(--text-secondary)"
                      >
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="email"
                        className="text-sm text-(--text-secondary)"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        disabled
                        className="mt-2 opacity-60"
                      />
                      <p className="mt-1 text-xs text-(--text-muted)">
                        Email cannot be changed
                      </p>
                    </div>

                    {updateError && (
                      <div className="rounded-lg border border-(--error) bg-(--error)/10 px-4 py-3">
                        <p className="text-sm text-(--error)">{updateError}</p>
                      </div>
                    )}

                    {updateSuccess && (
                      <div className="rounded-lg border border-(--status-success) bg-(--status-success)/10 px-4 py-3">
                        <p className="text-sm text-(--status-success)">
                          Profile updated successfully
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={updateLoading}
                      className="w-full"
                    >
                      {updateLoading ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="rounded-2xl bg-(--surface-bg)/90 p-6 shadow-sm">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-lg font-semibold">
                    Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div>
                    <Label className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">
                      User ID
                    </Label>
                    <p className="mt-2 text-sm font-mono text-(--text-primary) break-all">
                      {user.id}
                    </p>
                  </div>

                  {user.role && (
                    <div>
                      <Label className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">
                        Role
                      </Label>
                      <p className="mt-2">
                        <span className="inline-block rounded-full border border-(--border-color) px-3 py-1 text-xs uppercase tracking-wider text-(--text-primary)">
                          {user.role}
                        </span>
                      </p>
                    </div>
                  )}

                  {user.created_at && (
                    <div>
                      <Label className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">
                        Member Since
                      </Label>
                      <p className="mt-2 text-sm text-(--text-primary)">
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}

                  {user.organization_id && (
                    <div>
                      <Label className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">
                        Organization ID
                      </Label>
                      <p className="mt-2 text-sm font-mono text-(--text-primary) break-all">
                        {user.organization_id}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl bg-(--surface-bg)/90 p-6 shadow-sm">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg font-semibold">
                  Security
                </CardTitle>
                <CardDescription>
                  Manage your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-(--border-color) bg-(--page-bg) p-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-(--text-primary)">
                        Password
                      </p>
                      <p className="text-xs text-(--text-muted)">
                        Last changed: Never
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      disabled
                      className="w-full sm:w-auto whitespace-nowrap"
                    >
                      Change Password
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-(--border-color) bg-(--page-bg) p-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-(--text-primary)">
                        Two-Factor Authentication
                      </p>
                      <p className="text-xs text-(--text-muted)">Not enabled</p>
                    </div>
                    <Button
                      variant="outline"
                      disabled
                      className="w-full sm:w-auto whitespace-nowrap"
                    >
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
