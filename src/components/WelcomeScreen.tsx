import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="text-center max-w-sm mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Muslim Pocket</h1>
        <p className="text-white/80 mb-8 text-lg">Belajar 1% Setiap Hari</p>

        {/* Decorative stars */}
        <div className="relative mb-8">
          <div className="absolute top-4 left-8 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-12 w-1 h-1 bg-yellow-200 rounded-full animate-pulse delay-100"></div>
          <div className="absolute top-16 left-16 w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-200"></div>
          <div className="absolute bottom-20 right-8 w-1 h-1 bg-yellow-300 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-32 left-4 w-1 h-1 bg-yellow-200 rounded-full animate-pulse delay-500"></div>

          {/* Clouds */}
          <div className="absolute top-12 right-4 w-8 h-4 bg-white/20 rounded-full"></div>
          <div className="absolute top-14 right-6 w-6 h-3 bg-white/15 rounded-full"></div>
          <div className="absolute bottom-24 left-8 w-10 h-5 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-26 left-6 w-8 h-4 bg-white/15 rounded-full"></div>

          {/* Main Book Illustration */}
          <div className="relative mx-auto w-48 h-32 mb-8">
            {/* Book Stand */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-purple-800/30 rounded-full"></div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-3 bg-purple-700 rounded-lg"></div>

            {/* Open Book */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 -rotate-12">
              <div className="relative">
                {/* Right page */}
                <div className="w-20 h-24 bg-gradient-to-br from-white to-gray-100 rounded-r-xl shadow-2xl border-l border-gray-200">
                  <div className="p-3">
                    <div className="h-1 bg-gray-300 rounded mb-2"></div>
                    <div className="h-1 bg-gray-300 rounded mb-2"></div>
                    <div className="h-1 bg-gray-200 rounded mb-2"></div>
                    <div className="h-1 bg-gray-300 rounded mb-2"></div>
                    <div className="h-1 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rotate-12">
              <div className="relative">
                {/* Left page */}
                <div className="w-20 h-24 bg-gradient-to-bl from-white to-gray-100 rounded-l-xl shadow-2xl border-r border-gray-200">
                  <div className="p-3">
                    <div className="h-1 bg-gray-300 rounded mb-2"></div>
                    <div className="h-1 bg-gray-300 rounded mb-2"></div>
                    <div className="h-1 bg-gray-200 rounded mb-2"></div>
                    <div className="h-1 bg-gray-300 rounded mb-2"></div>
                    <div className="h-1 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Book spine/binding */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-24 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full shadow-lg"></div>
          </div>
        </div>

        <Button
          onClick={onGetStarted}
          className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-4 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
