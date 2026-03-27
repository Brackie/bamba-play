type AvatarSize = "sm" | "md" | "lg";

interface UserAvatarProps {
  username: string;
  avatar: string | null;
  size?: AvatarSize;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
};

function getColorFromUsername(username: string): string {
  const colors = [
    "bg-brand-600",
    "bg-purple-600",
    "bg-green-600",
    "bg-orange-600",
    "bg-teal-600",
    "bg-pink-600",
    "bg-indigo-600",
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function UserAvatar({ username, avatar, size = "md" }: UserAvatarProps) {
  const sizeClass = sizeStyles[size];

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={username}
        className={`${sizeClass} rounded-full object-cover`}
      />
    );
  }

  const bgColor = getColorFromUsername(username);
  const initial = username.charAt(0).toUpperCase();

  return (
    <div
      className={`${sizeClass} ${bgColor} inline-flex items-center justify-center rounded-full font-semibold text-white`}
    >
      {initial}
    </div>
  );
}
