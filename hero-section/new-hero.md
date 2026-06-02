<div class="">
    <header class="py-4 bg-black sm:py-6" x-data="{expanded: false}">
        <div class="px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between">
                <div class="shrink-0">
                    <a href="#" title="" class="flex">
                        <img class="w-auto h-9" src="https://landingfoliocom.imgix.net/store/collection/dusk/images/logo.svg" alt="" />
                    </a>
                </div>

                <div class="flex md:hidden">
                    <button type="button" class="text-white" @click="expanded = !expanded" :aria-expanded="expanded">
                        <span x-show="!expanded" aria-hidden="true">
                            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </span>

                        <span x-show="expanded" aria-hidden="true">
                            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </span>
                    </button>
                </div>

                <nav class="hidden space-x-10 md:flex md:items-center md:justify-center lg:space-x-12">
                    <a href="#" title="" class="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"> Products </a>

                    <a href="#" title="" class="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"> Features </a>

                    <a href="#" title="" class="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"> Pricing </a>

                    <a href="#" title="" class="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"> Support </a>
                </nav>

                <div class="relative hidden md:justify-center md:items-center md:inline-flex group">
                    <div class="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
                    <a href="#" title="" class="relative inline-flex items-center justify-center px-6 py-2 text-base font-normal text-white bg-black border border-transparent rounded-full" role="button"> Start free trial </a>
                </div>
            </div>

            <nav x-show="expanded" x-collapse>
                <div class="flex flex-col pt-8 pb-4 space-y-6">
                    <a href="#" title="" class="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"> Products </a>

                    <a href="#" title="" class="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"> Features </a>

                    <a href="#" title="" class="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"> Pricing </a>

                    <a href="#" title="" class="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"> Support </a>

                    <div class="relative inline-flex items-center justify-center group">
                        <div class="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
                        <a href="#" title="" class="relative inline-flex items-center justify-center w-full px-6 py-2 text-base font-normal text-white bg-black border border-transparent rounded-full" role="button"> Start free trial </a>
                    </div>
                </div>
            </nav>
        </div>
    </header>

    <section class="relative pt-12 overflow-hidden bg-black sm:pt-16">
        <div class="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div class="max-w-4xl mx-auto text-center">
                <p class="text-sm font-normal tracking-widest uppercase">
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500"> Your startup needs a kick </span>
                </p>
                <h1 class="mt-8 text-4xl font-normal text-white sm:text-5xl lg:text-6xl xl:text-7xl">Connect & grow with your targeted customers</h1>

                <div class="flex flex-col items-center justify-center px-8 mt-12 space-y-5 sm:space-y-0 sm:px-0 sm:space-x-5 sm:flex-row">
                    <div class="relative inline-flex items-center justify-center w-full sm:w-auto group">
                        <div class="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
                        <a href="#" title="" class="relative inline-flex items-center justify-center w-full px-8 py-3 text-base font-normal text-white bg-black border border-transparent rounded-full sm:w-auto" role="button"> Start 14 Days Free Trial </a>
                    </div>

                    <a href="#" title="" class="inline-flex items-center justify-center w-full px-8 py-3 text-base font-normal text-white transition-all duration-200 bg-black border border-gray-600 rounded-full sm:w-auto hover:border-white" role="button"> Talk to Sales </a>
                </div>
            </div>

            <div class="relative mt-12 -mb-4 sm:-mb-10 lg:-mb-12 sm:mt-16 lg:mt-24">
                <div class="absolute top-0 transform -translate-x-1/2 left-1/2">
                    <svg class="blur-3xl filter" style="filter: blur(64px)" width="645" height="413" viewBox="0 0 645 413" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M181.316 218.778C86.2529 123.715 -63.7045 134.94 31.3589 39.8762C126.422 -55.1873 528.427 41.1918 623.49 136.255C718.554 231.319 470.678 289.068 375.614 384.131C280.551 479.195 276.38 313.842 181.316 218.778Z" fill="url(#d)" />
                        <defs>
                            <linearGradient id="d" x1="665.741" y1="178.506" x2="296.286" y2="474.62" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" style="stop-color: var(--color-cyan-500)" />
                                <stop offset="100%" style="stop-color: var(--color-purple-500)" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <div class="absolute inset-0">
                    <img class="object-cover w-full h-full opacity-50" src="https://landingfoliocom.imgix.net/store/collection/dusk/images/noise.png" alt="" />
                </div>

                <img class="relative w-full max-w-5xl mx-auto" src="https://landingfoliocom.imgix.net/store/collection/dusk/images/hero/4/dashboard-mockup.png" alt="" />
            </div>
        </div>
    </section>
</div>
