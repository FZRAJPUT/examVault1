const getFileSize = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl, { 
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FileSizeBot/1.0)'
        }
      });
      
      if (!response.ok) {
        console.warn('Failed to fetch file info:', response.status);
        return null;
      }
      
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const sizeInBytes = parseInt(contentLength, 10);
        if (isNaN(sizeInBytes) || sizeInBytes <= 0) {
          console.warn('Invalid content length:', contentLength);
          return null;
        }
        
        // Convert to KB and round to 1 decimal place
        const sizeInKB = Math.round((sizeInBytes / 1024) * 10) / 10;
        console.log('File size:', sizeInKB, 'KB');
        return sizeInKB;
      } else {
        console.log('Content-Length header not found');
        return null;
      }
    } catch (error) {
      console.log('Error fetching file size:', error);
      return null;
    }
  };

  export default getFileSize
  