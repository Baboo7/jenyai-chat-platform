export class Parser {

  // Formats an incomming message to a component data input
  // Returns a JSON object
  static format(data: any, emitterType: string): any {
    let obj: any = {
      align: data.emitterType === emitterType ? 'right' : 'left',
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
      }
    }

    return null;
  }
}
