import React from "react";

const Avatar = ({ name, avatarUrl, size = 32 }) => {
  const initials = name
    ? `${name.split(" ")[0]?.[0] || ""}${
        name.split(" ")[1]?.[0] || ""
      }`.toUpperCase()
    : "?";

  return avatarUrl ? (
    <img
      src={avatarUrl}
      alt={name}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className="flex items-center justify-center rounded-full bg-fuchsia-200 text-fuchsia-950 font-semibold"
      style={{ width: size, height: size, fontSize: size / 2.5 }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
