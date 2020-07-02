export const getQuote = async (title: string) => {
  return new Promise<number>((resolve, _) => {
    setTimeout(() => {
      resolve(title.length < 5 ? 100 : 200);
    }, 1000);
  })
}