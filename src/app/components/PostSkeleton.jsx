export default function PostSkeleton(){
    return (
        <>
            <div className="p-4 border-b border-gray-200 dark:border-slate-800 my-2 bg-white dark:bg-slate-950 shadow-sm animate-pulse w-full">
                <div className="flex items-center mb-2">
                    <div  className="w-14 h-14 bg-gray-200 dark:bg-slate-700 rounded-full mr-3" ></div>
                    <div>
                        <div className="font-semibold text-gray-700 dark:text-slate-400 hover:text-blue-600 flex items-center " >
                            <span className="block w-48 h-6 bg-gray-200 dark:bg-slate-700 rounded"></span>
                            <span className="block ml-2 w-6 h-6 bg-gray-200 dark:bg-slate-700 rounded"></span>
                        </div>
                        <div className="relative inline-block text-xs text-gray-500 dark:text-slate-500"  >
                            <p className="text-xs text-gray-500 w-36 bg-gray-50 dark:bg-slate-900 h-4 mt-1" >  </p>
                        </div>
                    </div>
                </div>
                <p className="text-slate-800 dark:text-slate-300 mb-2 w-full h-4 bg-gray-200 dark:bg-slate-700 rounded"></p>
                <p className="text-slate-800 dark:text-slate-300 mb-2 w-full h-4 bg-gray-200 dark:bg-slate-700 rounded"></p>
                <p className="text-slate-800 dark:text-slate-300 mb-2 w-3/4 h-4 bg-gray-200 dark:bg-slate-700 rounded"></p>
                {/* <small className="text-xs">{postId}</small> */}
                <div className="text-sm text-gray-500 dark:text-slate-50 flex items-center">
                    <span className="block w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-800 mr-4 rounded"></span>
                    <span className="block w-12 h-4 bg-gray-100 dark:bg-slate-800 rounded"></span>
                </div>
            </div>
        </>
    )
}