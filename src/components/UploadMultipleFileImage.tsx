import React from "react";
import Image from "next/image";
import { uploadFile } from "@/utils/uploadFile";
import { Upload, X, ImageIcon, Loader2, Plus, AlertCircle } from "lucide-react";

interface UploadMultipleFileImageProps {
    onUploaded: (urls: string[]) => void;
    value?: string[];
}

interface ImageItem {
    id: string;
    url: string;
    file?: File;
    isUploading?: boolean;
    previewUrl?: string;
    hasError?: boolean;
}

const UploadMultipleFileImage: React.FC<UploadMultipleFileImageProps> = ({ 
    onUploaded, 
    value = [] 
}) => {
    const [loading, setLoading] = React.useState(false);
    const [images, setImages] = React.useState<ImageItem[]>([]);
    const [dragOver, setDragOver] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const imageItems: ImageItem[] = value.map((url, index) => ({
            id: `existing-${index}`,
            url,
            isUploading: false
        }));
        setImages(imageItems);
    }, [value]);

    const createPreviewUrl = (file: File): string => {
        return URL.createObjectURL(file);
    };

    const handleChange = async (files: FileList | null) => {
        if (!files) return;
        
        // Create preview images immediately
        const newImages: ImageItem[] = Array.from(files).map((file, index) => ({
            id: `upload-${Date.now()}-${index}`,
            url: '',
            file,
            previewUrl: createPreviewUrl(file),
            isUploading: true,
            hasError: false
        }));

        setImages(prev => [...prev, ...newImages]);
        setLoading(true);

        // Upload files
        const uploadPromises = newImages.map(async (imageItem) => {
            try {
                const downloadURL = await uploadFile(imageItem.file!);
                
                setImages(prevImages => 
                    prevImages.map(img => 
                        img.id === imageItem.id 
                            ? { ...img, url: downloadURL, isUploading: false }
                            : img
                    )
                );
                
                return downloadURL;
            } catch (error) {
                console.error('Upload failed:', error);
                
                setImages(prevImages => 
                    prevImages.map(img => 
                        img.id === imageItem.id 
                            ? { ...img, isUploading: false, hasError: true }
                            : img
                    )
                );
                
                return null;
            }
        });

        const results = await Promise.all(uploadPromises);
        const successfulUrls = results.filter(url => url !== null) as string[];
        
        const allSuccessfulUrls = images
            .filter(img => !img.isUploading && img.url)
            .map(img => img.url)
            .concat(successfulUrls);
            
        onUploaded(allSuccessfulUrls);
        setLoading(false);

        // Cleanup preview URLs
        newImages.forEach(img => {
            if (img.previewUrl) {
                URL.revokeObjectURL(img.previewUrl);
            }
        });
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e.target.files);
        e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        handleChange(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
    };

    const handleRemove = (imageItem: ImageItem) => {
        if (imageItem.previewUrl) {
            URL.revokeObjectURL(imageItem.previewUrl);
        }
        
        const newImages = images.filter((img) => img.id !== imageItem.id);
        setImages(newImages);
        
        const successfulUrls = newImages
            .filter(img => !img.isUploading && img.url)
            .map(img => img.url);
            
        onUploaded(successfulUrls);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleRetry = async (imageItem: ImageItem) => {
        if (!imageItem.file || imageItem.isUploading) return;
        
        setImages(prevImages => 
            prevImages.map(img => 
                img.id === imageItem.id 
                    ? { ...img, isUploading: true, hasError: false }
                    : img
            )
        );

        try {
            const downloadURL = await uploadFile(imageItem.file);
            
            setImages(prevImages => 
                prevImages.map(img => 
                    img.id === imageItem.id 
                        ? { ...img, url: downloadURL, isUploading: false }
                        : img
                )
            );

            const allSuccessfulUrls = images
                .filter(img => !img.isUploading && img.url)
                .map(img => img.url)
                .concat([downloadURL]);
                
            onUploaded(allSuccessfulUrls);
            
        } catch (error) {
            console.error('Retry upload failed:', error);
            
            setImages(prevImages => 
                prevImages.map(img => 
                    img.id === imageItem.id 
                        ? { ...img, isUploading: false, hasError: true }
                        : img
                )
            );
        }
    };

    const getImageSrc = (imageItem: ImageItem): string => {
        if (imageItem.isUploading || (!imageItem.url && imageItem.previewUrl)) {
            return imageItem.previewUrl || '';
        }
        return imageItem.url || '';
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
                    ${dragOver 
                        ? 'border-blue-500 bg-blue-50' 
                        : loading 
                        ? 'border-gray-300 bg-gray-50' 
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }
                    ${loading ? 'pointer-events-none' : ''}
                    ${images.length > 0 ? 'p-4' : 'p-8'}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleUploadClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInput}
                    disabled={loading}
                    className="hidden"
                />
                
                <div className="flex flex-col items-center justify-center space-y-3">
                    {loading ? (
                        <>
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                            <p className="text-sm text-gray-600">Đang tải lên...</p>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                                {images.length > 0 ? (
                                    <Plus className="w-8 h-8 text-gray-500" />
                                ) : (
                                    <Upload className="w-8 h-8 text-gray-500" />
                                )}
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700">
                                    {images.length > 0 ? 'Thêm ảnh' : 'Tải lên hình ảnh'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Kéo thả hoặc nhấp để chọn ảnh
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    PNG, JPG, GIF • Tối đa 10MB
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Image Gallery */}
            {images.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <ImageIcon className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                                Hình ảnh ({images.filter(img => !img.isUploading && img.url).length}/{images.length})
                            </span>
                        </div>
                        {loading && (
                            <div className="flex items-center space-x-2 text-sm text-blue-600">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Đang xử lý...</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {images.map((imageItem, idx) => {
                            const imageSrc = getImageSrc(imageItem);
                            
                            return (
                                <div 
                                    key={imageItem.id} 
                                    className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    {imageSrc ? (
                                        <Image
                                            src={imageSrc}
                                            alt={`Ảnh ${idx + 1}`}
                                            fill
                                            className={`object-cover transition-all duration-200 ${
                                                imageItem.isUploading ? 'opacity-60 scale-105' : 'opacity-100 group-hover:scale-105'
                                            }`}
                                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                    
                                    {/* Upload Status Overlay */}
                                    {imageItem.isUploading && (
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <Loader2 className="w-6 h-6 mx-auto animate-spin mb-1" />
                                                <span className="text-xs">Uploading...</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Error State */}
                                    {imageItem.hasError && (
                                        <div className="absolute inset-0 bg-red-500 bg-opacity-90 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <AlertCircle className="w-6 h-6 mx-auto mb-1" />
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRetry(imageItem);
                                                    }}
                                                    className="text-xs underline hover:no-underline"
                                                >
                                                    Thử lại
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Success Indicator */}
                                    {!imageItem.isUploading && !imageItem.hasError && imageItem.url && (
                                        <div className="absolute top-2 left-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                    
                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(imageItem);
                                        }}
                                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg transform hover:scale-110"
                                        title="Xóa ảnh"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    
                                    {/* Image Index */}
                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        #{idx + 1}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            
            {/* Empty State */}
            {images.length === 0 && !loading && (
                <div className="text-center py-6">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-1">Chưa có ảnh nào được tải lên</p>
                    <p className="text-xs text-gray-400">Nhấp vào vùng tải lên để bắt đầu</p>
                </div>
            )}
        </div>
    );
};

export default UploadMultipleFileImage;