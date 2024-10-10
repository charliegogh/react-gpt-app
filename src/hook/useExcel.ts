function loadScript() {
  return new Promise((resolve, reject) => {
    if ((window as any).XLSX) {
      resolve((window as any).XLSX)
    } else {
      const script = document.createElement('script')
      script.src = 'https://picx.cnki.net/psmc/v2/xlsx.full.min.js'
      script.async = false
      script.onload = () => {
        resolve((window as any).XLSX)
      }
      script.onerror = reject
      document.head.appendChild(script)
    }
  })
}
async function exportToExcel(data: any[], fileName: string): Promise<void> {
  try {
    const XLSX:any = await loadScript()
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
  } catch (error) {
    console.error('Failed to load XLSX or export the file:', error)
  }
}

export {
  exportToExcel
}
