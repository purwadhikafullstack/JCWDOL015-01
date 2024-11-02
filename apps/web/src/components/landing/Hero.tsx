import Image from 'next/image';
export default function Hero() {
  return (
    <div className="carousel w-full h-[800px] relative">
      <div id="slide1" className="carousel-item relative w-full items-center">
        <Image
          src="/hero1.png"
          alt="hero"
          width={1200}
          height={720}
          className="w-full h-3/4 absolute top-0 inset-x-0"
        />

        <div className="absolute h-1/4 bottom-0 text-center items-center w-full p-5 ">
            <h1 className=''>Welcome to OntoEmployee</h1>
            <p className=''>The job board that can jumpstart your career</p>
        </div>

        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
          <a href="#slide4" className="btn btn-circle">
            ❮
          </a>
          <a href="#slide2" className="btn btn-circle">
            ❯
          </a>
        </div>
      </div>
      <div id="slide2" className="carousel-item relative w-full items-center">
      <Image
          src="/hero2.png"
          alt="hero"
          width={1200}
          height={720}
          className="w-[40%] h-1/2 absolute left-0"
        />
        <div className="absolute right-0 w-1/2 items-center p-20 mr-20">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi illum dolorum eos corporis, sunt ipsam officiis cum mollitia ut aliquid soluta, unde sed. Repellendus possimus impedit a doloremque.
        </div>
        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
          <a href="#slide1" className="btn btn-circle">
            ❮
          </a>
          <a href="#slide3" className="btn btn-circle">
            ❯
          </a>
        </div>
      </div>
      <div id="slide3" className="carousel-item items-center relative w-full">
      <Image
          src="/hero3.png"
          alt="hero"
          width={1200}
          height={720}
          className="w-[40%] h-1/2 absolute right-0"
        />
        <div className="absolute left-0 w-1/2 items-center p-20 ml-20">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi illum dolorum eos corporis, sunt ipsam officiis cum mollitia ut aliquid soluta, unde sed. Repellendus possimus impedit a doloremque.
        </div>
        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
          <a href="#slide2" className="btn btn-circle">
            ❮
          </a>
          <a href="#slide1" className="btn btn-circle">
            ❯
          </a>
        </div>
      </div>
      
    </div>
  );
}
