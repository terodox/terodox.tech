import React from "react";
import PropTypes from "prop-types";

const Article = props => {
  const { children, theme } = props;

  return (
    <React.Fragment>
      <div id="codefund"></div>
      <script src="https://codefund.io/properties/541/funder.js" async="async"></script>
      <article className="article">{children}</article>

      {/* --- STYLES --- */}
      <style jsx>{`
        #codefund {
          min-height: 100px;
          display: block !important;
          visibility: visible !important;
          background-color: red;
          padding: ${theme.space.inset.default};
          margin: 0 auto;
        }
        .article {
          padding: ${theme.space.inset.default};
          margin: 0 auto;
        }
        @from-width tablet {
          .article {
            max-width: ${theme.text.maxWidth.tablet};
          }
          #codefund {
            max-width: ${theme.text.maxWidth.tablet};
            padding: ${`calc(${theme.space.default}) calc(${theme.space.default} * 2)`};
          }
        }
        @from-width desktop {
          .article {
            max-width: ${theme.text.maxWidth.desktop};
          }
          #codefund {
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
