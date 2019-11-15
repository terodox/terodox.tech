import React from "react";
import PropTypes from "prop-types";

const Article = props => {
  const { children, theme } = props;

  return (
    <React.Fragment>
      <article className="article">{children}</article>

      {/* --- STYLES --- */}
      <style jsx>{`
        .article {
          padding: ${theme.space.inset.default};
          margin: 0 auto;
        }
        @from-width tablet {
          .article {
            max-width: ${theme.text.maxWidth.tablet};
            padding: ${`calc(${theme.space.default}) calc(${theme.space.default} * 2)`};
          }
        }
        @from-width desktop {
          .article {
            max-width: ${theme.text.maxWidth.desktop};
            padding: ${`calc(${theme.space.default} * 2 + 90px) 0 calc(${theme.space.default} * 2)`};
          }
        }
      `}</style>
    </React.Fragment>
  );
};

Article.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.object.isRequired
};

export default Article;
