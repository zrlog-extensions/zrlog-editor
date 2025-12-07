import Dragger from "antd/es/upload/Dragger";
import {CSSProperties, FunctionComponent, PropsWithChildren} from "react";
import {UploadConfig} from "../editor.types";

export type DraggerUploadResponse = { data: { url: string } };

type BaseDraggerProps = PropsWithChildren & {
    style?: CSSProperties;
    height?: number;
    accept?: string;
    action: string;
    name: string;
    onSuccess?: (data: DraggerUploadResponse) => void;
    onProgress?: (percent: number) => void;
    disabled?: boolean;
    onError?: (error: Error) => void;
    uploadConfig: UploadConfig;
};

const BaseDragger: FunctionComponent<BaseDraggerProps> = ({
                                                              children,
                                                              style,
                                                              action,
                                                              accept,
                                                              name,
                                                              onSuccess,
                                                              disabled,
                                                              onProgress,
                                                              onError,
                                                              uploadConfig,
                                                              height
                                                          }) => {

    const customRequest = async (options: any) => {
        const {file} = options;

        const formData = new FormData();
        formData.append(name, file);

        if (uploadConfig.axiosInstance) {
            try {
                const {data} = await uploadConfig.axiosInstance.post(action, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: ({total, loaded}) => {
                        if (total) {
                            const percent = Math.round((loaded / total) * 100);
                            if (onProgress) {
                                onProgress(percent);
                            }
                        }
                    },
                });

                if (data.error) {
                    if (onError) {
                        onError(new Error("upload error -> " + data.message));
                    }
                    return;
                }
                // 触发成功回调
                if (onSuccess) {
                    if (uploadConfig.tryAppendBackendServerUrl) {
                        data.data.url = uploadConfig.tryAppendBackendServerUrl(data.data.url);
                    }
                    onSuccess(data);
                }
            } catch (err: any) {
                console.error(err);
                if (onError) {
                    onError(err);
                }
            }
        }
    }

    return (
        <Dragger
            disabled={disabled}
            multiple={false}
            accept={accept}
            showUploadList={false}
            customRequest={customRequest}
            style={style}
            height={height}
        >
            {children}
        </Dragger>
    );
};

export default BaseDragger;
