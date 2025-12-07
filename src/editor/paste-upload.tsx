import {FunctionComponent, useEffect} from "react";
import {AxiosInstance} from "axios";

type PasteUploadProps = {
    onUploadSuccess: (imgUrl: string) => void;
    onUploading?: () => void;
    onUploadFailure?: () => void;
    getContainer?: () => HTMLElement;
    editorView?: HTMLElement;
    axiosInstance?: AxiosInstance;
    uploadFormName: string;
    tryAppendBackendServerUrl?: (string: string) => string;
};

const PasteUpload: FunctionComponent<PasteUploadProps> = ({
                                                              onUploadSuccess,
                                                              editorView,
                                                              onUploading,
                                                              onUploadFailure,
                                                              axiosInstance,
                                                              tryAppendBackendServerUrl,
                                                              uploadFormName
                                                          }) => {

    const getFileExt = (filename: string, defaultExt: string) => {
        if (!filename.includes(".")) {
            return defaultExt;
        }
        let ext = filename.substring(filename.lastIndexOf(".") + 1);
        if (ext.trim().length === 0) {
            ext = defaultExt;
        }
        return ext;
    };

    const uploadFile = async (file: File): Promise<string> => {
        const index = Math.random().toString(10).substr(2, 5) + "-" + Math.random().toString(36).substr(2);
        const fileName = index + "." + getFileExt(file.name, "jpg");
        const formData = new FormData();
        formData.append(uploadFormName, file, fileName);
        if (axiosInstance) {
            try {
                const {data} = await axiosInstance.post("/api/admin/upload?dir=image", formData);
                const url = data.data.url;
                if (url.startsWith("/") && tryAppendBackendServerUrl) {
                    return tryAppendBackendServerUrl(data.data.url.substring(1));
                }
                return url;
            } catch (e) {
                return "";
            }
        }
        return "";
    };

    const doUpload = async (e: ClipboardEvent) => {
        const clipboardData = e.clipboardData;
        if (clipboardData === null) {
            return;
        }
        const items = clipboardData.items;
        const imgFiles: File[] = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === "file" && items[i].type.match(/^image/)) {
                const file = items[i].getAsFile();
                if (file) {
                    imgFiles.push(file);
                }
            }
        }
        if (imgFiles.length > 0) {
            // 取消默认的粘贴操作
            e.preventDefault();
            if (onUploading) {
                onUploading();
            }
            const data = await Promise.all(
                imgFiles.map(async (e) => {
                    // 上传文件
                    return await uploadFile(e);
                })
            );
            data.forEach((e) => {
                if (e.length === 0) {
                    if (onUploadFailure) {
                        onUploadFailure();
                    }
                } else {
                    onUploadSuccess(e);
                }
            });
        }
    };

    const doHandler = () => {
        if (editorView) {
            editorView.addEventListener("paste", doUpload);
        }
    };

    useEffect(() => {
        doHandler();

        return () => {
            editorView?.removeEventListener("paste", doUpload);
        };
    }, []);

    return <></>;
};

export default PasteUpload;
