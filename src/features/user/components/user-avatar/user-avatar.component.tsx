import { userManager } from "@/features/auth/lib/oidc-client.lib.ts";
import {
  BellOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Typography } from "antd";
import type { User } from "oidc-client-ts";
import { useEffect, useState } from "react";

const { Text, Title } = Typography;

export const UserAvatar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    userManager.getUser().then((user) => {
      setUser(user);
      if (user?.profile?.avatarUrl) {
        // Optimize Google avatar URL to reduce rate limiting
        let optimizedAvatarUrl = user.profile.avatarUrl as string;

        // For Google URLs, reduce size and add cache-friendly parameters
        if (optimizedAvatarUrl.includes("googleusercontent.com")) {
          // Remove existing size parameter and add a smaller size
          optimizedAvatarUrl = optimizedAvatarUrl.replace(
            /=s\d+(-c)?$/,
            "=s40-c",
          );
          // If no size parameter exists, add one
          if (!optimizedAvatarUrl.includes("=s")) {
            optimizedAvatarUrl += "=s40-c";
          }
        }

        setAvatarSrc(optimizedAvatarUrl);
        setAvatarError(false);
      }
    });
  }, []);

  const handleAvatarError = () => {
    setAvatarError(true);
    setAvatarSrc(undefined);
    return false; // Prevent default error handling
  };

  const handleLogout = async () => {
    await userManager.signoutRedirect();
  };

  const handleProfile = () => {
    // Navigate to profile page
    console.log("Navigate to profile");
  };

  const handleSettings = () => {
    // Navigate to settings page
    console.log("Navigate to settings");
  };

  const handleNotifications = () => {
    // Navigate to notifications page
    console.log("Navigate to notifications");
  };

  if (!user) {
    return null;
  }

  // Get user initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userName =
    user.profile?.name || user.profile?.preferred_username || "User";
  const userEmail = user.profile?.email;

  const menuItems = [
    {
      key: "user-info",
      label: (
        <div
          style={{
            padding: "8px 0",
            borderBottom: "1px solid #f0f0f0",
            marginBottom: "8px",
          }}
        >
          <Title level={5} style={{ margin: 0, fontSize: "14px" }}>
            {userName}
          </Title>
          {userEmail && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {userEmail}
            </Text>
          )}
        </div>
      ),
      disabled: true,
    },
    {
      key: "profile",
      icon: <ProfileOutlined />,
      label: "Profile",
      onClick: handleProfile,
    },
    {
      key: "notifications",
      icon: <BellOutlined />,
      label: "Notifications",
      onClick: handleNotifications,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: handleSettings,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={["click"]}
      placement="bottomRight"
      arrow
    >
      <Avatar
        size="default"
        icon={<UserOutlined />}
        src={!avatarError ? avatarSrc : undefined}
        alt={userName}
        onError={handleAvatarError}
        style={{ cursor: "pointer" }}
      >
        {(avatarError || !avatarSrc) && getInitials(userName)}
      </Avatar>
    </Dropdown>
  );
};
