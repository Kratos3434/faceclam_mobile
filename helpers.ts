export const monthToString = (month: number) => {
  switch (month) {
      case 0:
          return "January"
      case 1:
          return "February"
      case 2:
          return "March"
      case 3:
          return "April"
      case 4:
          return "May"
      case 5:
          return "June"
      case 6:
          return "July"
      case 7:
          return "August"
      case 8:
          return "September"
      case 9:
          return "October"
      case 10:
          return "November"
      case 11:
          return "December"
  }
}

export const generateDate = (createdAt: string) => {
  const created = new Date(createdAt);

  return `${monthToString(created.getMonth())} ${created.getDate()}, ${created.getFullYear()}`
}

// export const linkifyDescrip = (text: string) => {
//   return { __html: linkifyHtml(text, { defaultProtocol: 'https', target: '_blank' }) }
// }

export const checkValidFileType = (ext: string) => {
    switch (ext) {
        case "image/jpg":
        case "image/jpeg":
        case "image/png":
        case "image/gif":
        case "image/webp":
        case "image/flif":
        case "image/cr2":
        case "image/tif":
        case "image/bmp":
        case "image/jxr":
        case "image/psd":
        case "image/ico":
        case "image/bpg":
        case "image/jp2":
        case "image/jpm":
        case "image/jpx":
        case "image/heic":
        case "image/cur":
        case "image/dcm":
        case "image/svg":
        case "video/mp4":
            return true;
        default:
            return false;
    }
}