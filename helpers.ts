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

const convertTo12Hour = (createdAt: string) => {
    const date = new Date(createdAt);
    let hour = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hour < 12 ? 'am' : 'pm';
    hour %= 12;
    hour = hour ? hour : 12;
    return `${hour}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
  }

export const generateDate = (createdAt: string) => {
  const created = new Date(createdAt);

  return `${monthToString(created.getMonth())} ${created.getDate()}, ${created.getFullYear()} at ${convertTo12Hour(createdAt)}`;
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

export const httpToHTTPS = (media: string) => {
    return `https${media.substring(media.indexOf(':'))}`;
}