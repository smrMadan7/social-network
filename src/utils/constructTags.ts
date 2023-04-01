const constructTags = async (content: any) => {


    const regex = /@\[(\w+)\]\((\w+)\)/g;
    const usernames = [];

    let matches;
    const tags = [];
    
    while ((matches = regex.exec(content)) !== null) {
      const handle = matches[1];
      const address = matches[2];
      tags.push({ handle, address });
    }
    return tags;

}

export default constructTags;