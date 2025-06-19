export default function UserInfoSkeleton(){
    return (
        <>
            <div className="bg-white dark:bg-slate-950 rounded-lg shadow-lg max-w-md mx-auto p-6 relative animate-pulse">

                <div className="flex items-center space-x-6">
                    {/* Profile Image */}
                    <div className="relative group cursor-pointer">
                        <div className="size-24 bg-gray-200 dark:bg-slate-700 rounded-full" ></div>
                        {true && (<span className="absolute bottom-0 right-0 bg-gray-300 dark:bg-slate-600 text-white text-xs px-2 py-1 rounded-full h-6 w-6"></span>)}
                    </div>

                    {/* User Info */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200 h-6 w-48 bg-gray-200 dark:bg-slate-700 "></h1>
                        <p className="text-sm text-gray-700 dark:text-gray-400 h-4 w-40 bg-gray-100 dark:bg-slate-800"></p>
                    </div>
                </div>

                <span className="absolute top-4 right-4 text-neutral-800 dark:text-neutral-200 cursor-pointer h-2 w-6 bg-gray-200/70 dark:bg-slate-700/70" ></span>

            </div>
            
        </>
    )
}