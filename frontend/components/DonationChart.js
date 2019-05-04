import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Chart } from 'react-google-charts'
import { distanceInWordsStrict } from 'date-fns'
import Typography from '@material-ui/core/Typography'
import { Button, CircularProgress } from '@material-ui/core'

import { colors, comparePlayerScores } from '../helpers'
import Chips from './Chips'

const styles = theme => ({
  container: {
    margin: 'auto',
    textAlign: 'center',
  },
  chartLoader: {
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    marginBottom: '20px',
  },
  loader: {
    margin: 'auto',
  },
  domainButtonContainer: {
    color: theme.palette.primary.dark,
  },
})

const chartOptions = {
  curveType: 'none',
  legend: 'none',
  colors,
  chartArea: { width: '85%', height: '70%' },
}

const chartDomains = ['All', 400, 100, 50]

class DonationChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartDomainIndex: 2,
      donorAmounts: [],
      excludedPeople: [],
      parsedDonations: null,
      totalDonated: null,
    }
  }

  componentDidMount() {
    const { donationData, names } = this.props
    
    const donorAmounts =  this.getMostRecentAmounts(donationData, names)
    const excludedPeople = donorAmounts.slice(10).map(player => player[0])
    const parsedDonations = this.parseDonations(null, donorAmounts, excludedPeople)
    const totalDonated = donorAmounts.reduce((acc, donor) => acc + donor[1], 0)
    this.setState({
      parsedDonations,
      donorAmounts,
      excludedPeople,
      totalDonated,
    })
  }

  getMostRecentAmounts(donationData, names) {
    const donorAmounts = names.map(name => {
      let person
      let i = donationData.length - 1
      while (!person && i > 0) {
        person = donationData[i].people.find(el => el.name === name)
        i--
      }
      console.log([name, person.amount]);
      return [name, person.amount]
    })
    let sorted = donorAmounts.sort(comparePlayerScores)
    console.log(sorted);
    return sorted
  }

  onChipClick = name => {
    const { excludedPeople } = this.state
    if (excludedPeople.includes(name)) {
      const index = excludedPeople.indexOf(name)
      excludedPeople.splice(index, 1)
    } else {
      excludedPeople.push(name)
    }
    const parsedDonations = this.parseDonations(null, null, excludedPeople)
    this.setState({
      parsedDonations,
      excludedPeople,
    })
  }

  getCurrentAmount(name, donationData, raceCounter) {
    let currentScore
    let i = raceCounter
    while (currentScore === undefined && i >= 0) {
      const donorInfo = donationData[i].people.find(el => el.name == name)
      if (donorInfo) {
        currentScore = donorInfo.amount
      }
      i -= 1
    }
    return currentScore
  }

  changeDomain = index => {
    const parsedDonations = this.parseDonations(index, null, null)
    this.setState({
      parsedDonations,
      chartDomainIndex: index,
    })
  }

  parseDonations(chartDomainIndexParam, donorAmountsParam, excludedPeopleParam) {
    const { donationData } = this.props

    // Get the domain for the chart
    const chartDomainIndex =
      chartDomainIndexParam === null || chartDomainIndexParam === undefined
        ? this.state.chartDomainIndex
        : chartDomainIndexParam

    const excludedPeople = excludedPeopleParam || this.state.excludedPeople
    const donorAmounts = donorAmountsParam || this.state.donorAmounts
    const parsedColors = colors.slice()
    const colorsToRemove = []

    if (donationData && donationData.length !== 0) {
      const parsedData = [['Race']]

      // Find the domain of the chart
      let startIndex = 0
      const chartDomain = chartDomains[chartDomainIndex]
      if (chartDomainIndex !== 0 && chartDomain < donationData.raceCounter) {
        startIndex = donationData.raceCounter - chartDomain
      }

      // Add a column for each race
      for (let i = startIndex; i < donationData.length; i++) {
        parsedData.push([distanceInWordsStrict(
          new Date(donationData[i].date), new Date()
          ) + " ago"])
      }

      // Add scores for each donor
      donorAmounts.forEach((donor, i) => {
        const name = donor[0]
        // exclude excluded players
        if (!excludedPeople.includes(name)) {
          // Append Name
          parsedData[0].push(donor[0])

          // Append Scores
          let lastAmount = this.getCurrentAmount(name, donationData, startIndex)
          for (let j = 0; j < donationData.length; j++) {
            const donorInfo = donationData[j].people.find(el => el.name == name)
            if (donorInfo) {
              lastAmount = donorInfo.amount
            }
            parsedData[j + 1].push(lastAmount)
          }
        } else {
          colorsToRemove.push(i)
        }
      })
      for (let i = colorsToRemove.length - 1; i >= 0; i--) {
        parsedColors.splice(colorsToRemove[i], 1)
      }
      return [parsedData, parsedColors]
    }
  }

  render() {
    const { classes } = this.props
    const {
      chartDomainIndex,
      parsedDonations,
      donorAmounts,
      excludedPeople,
      totalDonated
    } = this.state

    let parsedData
    let parsedColors
    if (parsedDonations) {
      parsedData = parsedDonations[0]
      parsedColors = parsedDonations[1]
    }
    chartOptions.colors = parsedColors

    return (
      <div className={classes.container}>
        <Typography variant="h4" className={classes.title}>
          The 40 Hour Jammin' Donation Leaderboard
        </Typography>
        <Typography variant="h4" className={classes.title}>
          Total Donated - ${totalDonated}
        </Typography>
        {parsedData !== undefined && parsedData.length > 1 ? (
          <div className={classes.root}>
            <Chips
              donorAmounts={donorAmounts}
              colors={colors}
              onClick={this.onChipClick}
              excludedPeople={excludedPeople}
            />
            {parsedData[0].length > 1 && (
              <div>
                <Chart
                  chartType="LineChart"
                  width="100%"
                  height="600px"
                  data={parsedData}
                  options={chartOptions}
                  loader={
                    <div className={classes.chartLoader}>
                      <CircularProgress className={classes.loader} />
                    </div>
                  }
                />
              </div>
            )}
            <div className={classes.domainButtonContainer}>
              {chartDomains.map((domain, index) => (
                <Button
                  key={index}
                  color="inherit"
                  size="small"
                  variant={chartDomainIndex === index ? 'outlined' : 'text'}
                  onClick={() => this.changeDomain(index)}
                >
                  {domain}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <Typography variant="body1">
              Add a race result to see the tournament statistics.
            </Typography>
          </div>
        )}
      </div>
    )
  }
}

DonationChart.propTypes = {
  donationData: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DonationChart)
