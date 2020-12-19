import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb  from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default() => {

  const [movieList, setMoveList] = useState([]);
  const [featuredData, setFeaturedData ] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(()=>{
    const loadAll = async () => {
        let list = await Tmdb.getHomeList();
        //pegando a lista total
        setMoveList(list);
        //pegando o filme em destaque - pegamos um dos filmes da lista de originals da netflix
        let originals = list.filter(i=>i.slug === 'originals');
        let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
        let chosen = originals[0].items.results[randomChosen];
        let choseInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
        setFeaturedData(choseInfo)
    }

    loadAll();
  }, [])

  useEffect(()=>{
    const scrollListiner = () => {
      if(window.scrollY) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }

    window.addEventListener('scroll', scrollListiner);

    return () => {
      window.removeEventListener('scroll', scrollListiner);
    }
  }, [])

  return (
    <div className="page">
      <Header  black={blackHeader} />
      {featuredData &&
         <FeaturedMovie item={featuredData}/>
      }
     
        <section className="lists">
          {movieList.map((item, key) =>(
            <MovieRow key={key} title={item.title} items={item.items}></MovieRow>
          ))
          }
        </section>

        <footer>
        Desenvolvido com ♡ por Júlio Filgueiras <br></br>
        Todos os direitos das imagens são da Netflix. <br></br>
        Dados Extraidos de https://www.themoviedb.org/
      </footer>


      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" alt="loading"></img>
        </div>
      }
    </div>
  );
}