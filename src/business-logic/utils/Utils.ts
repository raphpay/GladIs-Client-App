class Utils {
  static async getFileBase64FromURI(uri: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fetch(uri)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result.split(',')[1]; // Extract base64 string from data URL
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(error => reject(error));
    });
  }
}

export default Utils;
