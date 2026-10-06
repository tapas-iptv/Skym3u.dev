const username = "tapas-iptv"; // 
const repoName = "Skym3u.dev"; // 
const folderName = "SkyM3U"; 

async function loadFilesFromGitHub() {
    const playlistContainer = document.getElementById("playlist");
    playlistContainer.innerHTML = `<p class="text-slate-400 text-center py-6 text-sm sm:text-base">Loading files...</p>`; 

    const contentsUrl = `https://api.github.com/repos/${username}/${repoName}/contents/${folderName}`;

    try {
        let response = await fetch(contentsUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'SkyM3U-Portal'
            }
        });
        
        if (!response.ok) {
            throw new Error("GitHub API failed to fetch contents.");
        }

        let files = await response.json();
        playlistContainer.innerHTML = ""; 

        if (!Array.isArray(files) || files.length === 0) {
            playlistContainer.innerHTML = `<p class="text-slate-400 text-center py-6 text-sm sm:text-base">No files found in the folder.</p>`;
            return;
        }

        // গিটহাব থেকে যেভাবে ফাইলগুলো আসে, তার ঠিক উল্টো করে দেব (যাতে লেটেস্ট আপলোড করা ফাইল সবার উপরে থাকে)
        files.reverse();

        files.forEach(file => {
            if (file.type === "file") {
                let fileName = file.name; 
                let downloadUrl = `https://cdn.jsdelivr.net/gh/${username}/${repoName}@main/${folderName}/${fileName}`;

                let fileItem = `
                    <div class="bg-slate-700/40 hover:bg-slate-700/70 transition-all p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 border border-slate-600/40 shadow-sm">
                        <div class="w-full sm:w-auto overflow-hidden">
                            <h3 class="font-medium text-slate-100 text-sm sm:text-base flex items-center gap-2 truncate">
                                <span class="text-emerald-400 shrink-0">📄</span> 
                                <span class="truncate" title="${fileName}">${fileName}</span>
                            </h3>
                        </div>
                        <div class="flex items-center gap-2 w-full sm:w-auto">
                            <!-- Copy Link Button -->
                            <button onclick="copyRawLink('${downloadUrl}', this)" class="flex-1 sm:flex-none bg-slate-600 hover:bg-slate-500 text-slate-200 font-medium px-3.5 py-2.5 rounded-lg text-xs sm:text-sm text-center transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0">
                                🔗 Copy Link
                            </button>
                            <!-- Download Button -->
                            <button onclick="downloadOriginalFile('${downloadUrl}', '${fileName}')" class="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm text-center transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0">
                                📥 Download
                            </button>
                        </div>
                    </div>
                `;
                playlistContainer.innerHTML += fileItem;
            }
        });

    } catch (error) {
        console.error("Error:", error);
        playlistContainer.innerHTML = `<p class="text-red-400 text-center py-6 text-sm sm:text-base">Could not load files. Please check your GitHub username, repository name, or folder path.</p>`;
    }
}

// Raw Link ক্লিপবোর্ডে কপি করার ফাংশন
function copyRawLink(url, buttonElement) {
    navigator.clipboard.writeText(url).then(() => {
        let originalText = buttonElement.innerHTML;
        buttonElement.innerHTML = "✅ Copied!";
        buttonElement.classList.remove("bg-slate-600", "hover:bg-slate-500");
        buttonElement.classList.add("bg-sky-600", "hover:bg-sky-500");

        setTimeout(() => {
            buttonElement.innerHTML = originalText;
            buttonElement.classList.remove("bg-sky-600", "hover:bg-sky-500");
            buttonElement.classList.add("bg-slate-600", "hover:bg-slate-500");
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy link: ", err);
        alert("Failed to copy link.");
    });
}

// ডাউনলোড ফাংশন
async function downloadOriginalFile(url, filename) {
    try {
        let response = await fetch(url);
        let blob = await response.blob();
        let blobUrl = window.URL.createObjectURL(blob);
        
        let a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Download error:", error);
        window.open(url, '_blank');
    }
}

loadFilesFromGitHub();
