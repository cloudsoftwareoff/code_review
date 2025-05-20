import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Animation = () => {


  return (
    <div >
      {/* Animation Container */}
      <div className="w-full max-w-md h-64 mb-8">
        <DotLottieReact
          src="https://lottie.host/4a897482-8c9c-4ed8-996c-170911dca200/0KGgVFcAIx.lottie"
          loop
          autoplay
          className="w-full h-full"
        />
      </div>

    </div>
  );
};

export default Animation;