import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY =
  '5f2c1f6b0e5422d3ac07a2a4d2a5f5d74c54057f4dc7d1f36e7d8f1bfef55d14'
const SIGNATURE_KEY =
  'd783a4a15b673b3e0441268aeb88dc4d3848c8d12d6f230f732f7d9964ac6be7014b4e24db564b0c9e3d6e80f7a25eb731a7daec6c3a2383a7fe0b88aa489bd8'

export function encryptData(data: string) {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    ENCRYPTION_KEY,
  ).toString()
  const signature = CryptoJS.HmacSHA256(
    JSON.stringify(data),
    SIGNATURE_KEY,
  ).toString()
  return JSON.stringify({ data: encryptedData, signature })
}

export function decryptData(storedData: string) {
  const { data, signature } = JSON.parse(storedData)
  const isValidSignature =
    CryptoJS.HmacSHA256(data, SIGNATURE_KEY).toString() === signature
  if (isValidSignature) {
    const bytes = CryptoJS.AES.decrypt(data, ENCRYPTION_KEY)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  } else {
    throw new Error('Invalid signature')
  }
}
