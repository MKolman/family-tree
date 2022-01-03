// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import pb from "@/lib/family_pb";

function _base64ToArray(base64: string): Uint8Array {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}

async function getCryptoKey(key: string): Promise<CryptoKey> {
  const keyData = _base64ToArray(key);

  return await window.crypto.subtle.importKey(
    "raw",
    keyData,
    "AES-CBC",
    false, // can the key be extracted
    ["encrypt", "decrypt"]
  );
}

function decrypt(key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer> {
  const iv = _base64ToArray("mRr5NhSu23m53eyKV0sJAg==");
  return crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data);
}

export async function fetchAndDecryptFamily(
  url: string,
  pwd?: string
): Promise<pb.Family> {
  const response = await fetch(url);
  const buffer = response.arrayBuffer();
  if (!pwd || pwd.length == 0) {
    return pb.Family.deserializeBinary(await buffer);
  }
  const keyPromise = getCryptoKey(pwd);
  const key = await keyPromise;
  return pb.Family.deserializeBinary(await decrypt(key, await buffer));
}
