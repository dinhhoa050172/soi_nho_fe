export default function Loading() {

    
    return (
        <div className="flex items-center justify-center w-full h-200">
            <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" />
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-.3s]" />
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-.5s]" />
            </div>
        </div>
    );
}