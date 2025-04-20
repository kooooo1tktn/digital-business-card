export const createProfileLink = (
  type: "github" | "qiita" | "X",
  userId: string | null | undefined
): string => {
  if (!userId) return "#";
  switch (type) {
    case "github":
      return `https://github.com/${userId}`;
    case `qiita`:
      return `https://qiita.com/${userId}`;
    case "X":
      return `https://twitter.com/${userId}`;
    default:
      return "#";
  }
};
