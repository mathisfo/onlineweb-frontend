import React from 'react';

import { IArticle } from 'articles/models/Article';
import Markdown from 'common/components/Markdown/index';
import ResponsiveImage from 'common/components/ResponsiveImage';
import { Link } from 'core/components/Router';

import style from './articles.less';

const MainArticle = ({ heading, image, ingress, id }: IArticle) => {
  return (
    <Link href={`/articles/${id}`}>
      <a>
        <div className={style.articleContainer}>
          <ResponsiveImage image={image} size="sm" type="article" />
          <div>
            <h2>{heading}</h2>
            <Markdown source={ingress.replace(/#[^\s#]/g, (match) => `# ${match.slice(-1)}`)} />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default MainArticle;
