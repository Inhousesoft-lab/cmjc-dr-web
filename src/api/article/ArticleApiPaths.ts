export const selectArticleListApiPath = () => "/api/dr/articles";

export const createArticleApiPath = () => "/api/dr/articles";

export const updateArticleApiPath = (articleNo: string) =>
  `/api/dr/articles/${encodeURIComponent(articleNo)}`;
