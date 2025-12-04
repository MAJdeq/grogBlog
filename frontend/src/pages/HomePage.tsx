export const HomePage = () => {
  return (
    <div> 
      <p className="text-base sm:text-lg md:text-xl mb-4">
        Welcome to <em>GrogBlog</em>! This is your go-to spot for in-depth
        reviews and insights across <em>movies</em>, <em>games</em>, and the
        latest <em>tech trends</em>.
      </p>
      <p className="text-base sm:text-lg md:text-xl mb-4">
        We aim to provide content that entertains, informs, and inspires. Each
        post is crafted to give you a fresh perspective, whether it’s breaking
        down a game’s mechanics, exploring technological innovations, or
        reflecting on cinematic storytelling.
      </p>
      <p className="text-base sm:text-lg md:text-xl mb-2">
        Some of my personal interests include:
      </p>
      <ul className="list-disc list-inside text-base sm:text-lg md:text-xl space-y-1">
        <li><em>Ricing Linux</em></li>
        <li><em>Game theory</em></li>
        <li><em>Multi-agent systems</em></li>
        <li><em>Game Stuff</em></li>
      </ul>
    </div>
  );
};
