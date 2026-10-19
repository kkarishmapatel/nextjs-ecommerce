declare module "qrcode" {
  type QrCodeOptions = {
    width?: number;
    margin?: number;
  };

  const QRCode: {
    toDataURL(value: string, options?: QrCodeOptions): Promise<string>;
  };

  export default QRCode;
}
