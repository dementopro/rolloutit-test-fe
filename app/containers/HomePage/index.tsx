/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */


import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Helmet } from 'react-helmet-async';
import H2 from 'components/H2';
interface IMAGE {
  id: number;
  imageUrl: string;
  publishedDate: string;
  tags: string;
}

interface TAG {
  tag: string;
  frequency: string;
}

export default function HomePage() {
  const [page, setPage] = useState<number>(1);
  const [images, setImages] = useState<IMAGE[]>([]);
  const [topTags, setTopTags] = useState<TAG[]>([]);
  const [tag, setTag] = useState<string>("all");

  useEffect(() => {
    fetchImages();
  }, [page, tag]);

  const fetchImages = () => {
    fetch(`http://127.0.0.1:3001/images/${page}/${tag}`)
      .then(res => res.json())
      .then(data => {
        setImages(data.photos)
        setTopTags(data.topTags)
      })
      .catch(err => console.log(`Error fetching images:`, err))
  };

  const handleClick = (setting: string) => () => {
    setting === "prev" ? setPage(page - 1) : setPage(page + 1);
  };

  const handleTagClick = (tag: string) => () => {
    setTag(tag);
  };

  const handleRemove = (id: number) => () => {
    fetch(`http://127.0.0.1:3001/images/remove/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log(`Image removed`);
        if (data.status === "success") {
          fetchImages();
        }
      })
      .catch(err => console.log(`Error deleting image:`, err))
  };

  return (
    <div>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="A React.js Boilerplate application homepage"
        />
      </Helmet>
      <div style={{ marginBottom: '20px' }}>
        <button
          key="all"
          style={{ borderRadius: '10px', padding: '10px', margin: '5px', height: '40px', cursor: 'pointer'}}
          onClick={handleTagClick("all")}
        >
          All
        </button>
        {topTags.map((item: TAG) => (
          <button
            key={item.tag}
            style={{ borderRadius: '10px', padding: '10px', margin: '5px', height: '40px', cursor: 'pointer'}}
            onClick={handleTagClick(item.tag)}
          >
            {item.tag}
          </button>
        ))}
      </div>
      <div style={{ display: 'ruby' }}>
        {images.map(image => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} key={image.id}>
            <img style={{ padding: '10px' }} src={image.imageUrl} width={200} height={150} />
            <span>{moment(image.publishedDate).format("YYYY-MM-DD")}</span>
            <button onClick={handleRemove(image.id)}>Remove</button>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
        <button style={{ width: '50px', height: '50px' }} disabled={page === 1} onClick={handleClick("prev")}>&lt;</button>
        <H2 style={{ margin: '0px 20px'}}>{page}</H2>
        <button style={{ width: '50px', height: '50px' }} onClick={handleClick("next")}>&gt;</button>
      </div>
    </div>
  );
}
