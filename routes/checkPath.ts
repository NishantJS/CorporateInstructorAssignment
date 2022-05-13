export const checkPath = (file_path: string, user?: string, isT2S = false) => {
  try {
    if (!user) throw new Error("User unauthorized!")
    if (!file_path) throw new Error("Please provide file path!")

    const rootPath = `public/${user}/`
    const filepath = file_path.split("/");

    if (filepath.length !== 3 || filepath[0] !== "public") throw new Error("Invalide path!")
    if (filepath[1] !== user) throw new Error("You don't have permission to access other's files!");
    const [filename, fileext] = filepath[2].split(".")

    if (isT2S && fileext !== "txt") throw new Error("Only text files can be converted to speech!");
    return {
      error: false,
      path: { rootPath, filename, filepath, fileext }
    }
  } catch (error) {
    return { error: true, message: error?.message }
  }
}