    debugger;
        if (elem) hash[files[elem.file].replace(/\.gs$/, context.config.filetype)] = elem.content;
          hash[elem.file] = elem.content;
    const regex = new RegExp(`(.*?)(${context.config.filetype}|\.html)$`)
    const match = file.match(regex);