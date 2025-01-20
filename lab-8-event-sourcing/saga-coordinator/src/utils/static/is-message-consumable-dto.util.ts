export const isMessageConsumableDtoUtil = (message: unknown): message is { requestId: string } => {
  return Object.keys(message).includes('requestId');
}