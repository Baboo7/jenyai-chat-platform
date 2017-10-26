export class Parser {

  /*  Formats an incomming message to a component data input

    PARAMS
      data (object): contains the JSON representation of a message
      userId (sting): uuid of the user

    RETURN
      JSON object
*/
  static format(data: any, userId: string): any {
    let obj: any = {
      align: data.emitter === userId ? 'right' : 'left',
      emitter: data.emitter,
      emitterType: data.emitterType,
      recipient: data.recipient
    };

    let type = data.message.type;
    let payload = data.message.payload;
    if (type === 'text') {
      obj.type = type;
      obj.text = payload;
      return obj;
    } else if (type === 'video') {
      obj.type = type;
      if (payload.platform === 'vimeo') {
        obj.url = `https://player.vimeo.com/video/${payload.id}`;
        return obj;
      } else if (payload.platform === 'ytb') {
        obj.url = `https://www.youtube.com/embed/${payload.id}?`;
        if (payload.start) obj.url += `&start=${payload.start}`;
        if (payload.end) obj.url += `&end=${payload.end}`;
        return obj;
      }
    }

    return null;
  }
}
