export const AVATAR_COLORS = ["#c06010", "#8b6914", "#3d7a5c", "#5a4a8a", "#7a3d3d"];

export function avatarColor(id: string) {
    if (!id) return AVATAR_COLORS[0];
    return AVATAR_COLORS[id.charCodeAt(id.length - 1) % AVATAR_COLORS.length];
}

export function initials(name: string) {
    if (!name) return "U";
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}
