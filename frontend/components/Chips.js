import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const truncateName = (name, n) =>
  name.length > n ? `${name.substr(0, n - 1)}...` : name

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gridAutoFlow: 'dense',
  },
  playerButton: {
    margin: '8px',
    height: '30px',
    padding: '2px',
    borderRadius: '15px',
    background: '#ddd',
    fontAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    '&:hover': {
      cursor: 'pointer',
    },
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 20px 0px ${theme.palette.primary.main}`,
    },
  },
  bubble: {
    height: '16px',
    width: '16px',
    borderRadius: '50%',
    float: 'left',
  },
  text: {
    fontSize: '14px',
    marginLeft: '5px',
  },
  scoreChange: {
    marginLeft: '5px',
    fontWeight: '700',
  },
})

class Chips extends Component {
  render() {
    const {
      classes,
      donorAmounts,
      colors,
      onClick,
      excludedPeople,
    } = this.props

    return (
      <div className={classes.root}>
        {donorAmounts.map((player, index) => {
          const color = excludedPeople.includes(player[0])
            ? '#bbb'
            : colors[index]
          const [name, score] = player
          const truncatedName = truncateName(name, 15)

          return (
            <button
              type="button"
              onClick={() => onClick(player[0])}
              key={index}
              className={classes.playerButton}
              style={{
                outlineColor: color,
                border: `solid 3px ${color}`,
              }}
            >
              <span className={classes.text}>
                {truncatedName} <b>${score}</b>
              </span>
            </button>
          )
        })}
      </div>
    )
  }
}

Chips.propTypes = {
  classes: PropTypes.object.isRequired,
  donorAmounts: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  excludedPeople: PropTypes.array.isRequired,
}

export default withStyles(styles)(Chips)
