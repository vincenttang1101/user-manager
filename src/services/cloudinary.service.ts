import { HttpService } from "@/services/http.service";
import { AxiosRequestConfig } from "axios";

class CloudinaryService extends HttpService {
  private apiKey: string;
  private apiSecret: string;
  private cloudName: string;
  private uploadPreset: string;

  constructor() {
    super();
    this.apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
    (this.apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET),
      (this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    this.uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    this.instance.defaults.baseURL =
      import.meta.env.VITE_CLOUDINARY_API_BASE_URL;
  }

  async uploadImage(file: File): Promise<CloudinaryResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", this.uploadPreset);

    const config: AxiosRequestConfig = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    try {
      const response = await this.instance.post<CloudinaryResponse>(
        `/${this.cloudName}/image/upload`,
        formData,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  }

  async deleteImage(publicId: string) {
    const timestamp = new Date().getTime();
    const signature = await this.generateSignature(publicId, this.apiSecret);

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("signature", signature);
    formData.append("api_key", this.apiKey);
    formData.append("timestamp", timestamp.toString());

    try {
      const response = await this.instance.post<CloudinaryResponse>(
        `/${this.cloudName}/image/destroy`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      throw new Error("Failed to delete image from Cloudinary");
    }
  }

  async generateSignature(
    publicId: string,
    apiSecret: string
  ): Promise<string> {
    const timestamp = new Date().getTime();
    const str = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(str);

    const hashBuffer = await crypto.subtle.digest("SHA-1", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  }
  extractPublicIdFromUrl = (url: string): string => {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename.split(".")[0];
  };
}

type CloudinaryResponse = {
  secure_url: string;
  public_id: string;
};

const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
