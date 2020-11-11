import React from 'react';
import "./Poke.css"
import "./App.css"
import * as dayjs from 'dayjs'
import typeMap from './typeMap';

class PokeCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: dayjs(),
            daysArr: [],
            pokemonArr: [],
            typeArr: [],
            currentType: typeMap[dayjs().month()]
        }
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    async componentDidMount() {
        const promises = new Array(750)
            .fill()
            .map(async (v, i) => await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`));
        var resolved = await Promise.all(promises);
        var data = await Promise.all(resolved.map(res => res.json()));
        this.setState((state) => {
            return {
                ...state,
                pokemonArr: data
            }
        }, () => this.createPokeCalendar(this.state.date))
    }

    createPokeCalendar = (month) => {
        let firstDay = dayjs(month).startOf('M');
        let days = Array.apply(null, { length: month.daysInMonth() })
            .map(Number.call, Number)
            .map(n => {
                return dayjs(firstDay).add(n, 'd');
            })

        for (let n = 0; n < firstDay.day(); n++) {
            days.unshift(null);
        }

        days = this.appendPokemon(days);
        this.setState((state) => {
            return {
                ...state,
                daysArr: days
            }
        })
        console.log(this.state);
    };

    appendPokemon = (daysArr) => {
        if (!daysArr) return;
        const filteredState = this.filterArr(typeMap[this.state.date.month()])
        this.setState((state) => {
            return {
                ...state,
                typeArr: filteredState
            }
        })
        let newDays = daysArr.map((day, i) => {
            if (day) {
                return { day: day.date(), ...filteredState[i] };
            }
            return day;
        })
        return newDays;
    }

    nextMonth = () => {
        const newMonth = this.state.date.add(1, 'M');
        this.setState((state) => {
            return {
                ...state,
                date: newMonth,
                currentType: typeMap[newMonth.month()]
            }
        }, () => this.createPokeCalendar(newMonth))
    }

    previousMonth = () => {
        const newMonth = this.state.date.subtract(1, 'M');
        this.setState((state) => {
            return {
                ...state,
                date: newMonth,
                currentType: typeMap[newMonth.month()]
            }
        }, () => this.createPokeCalendar(newMonth))
    }

    filterArr = (type) => {
        var typePokemonArr = this.state.pokemonArr.filter((poke) => {
            let types = poke.types.map(({ type }) => type.name);
            return ~types.indexOf(type);
        })
        var types = typePokemonArr.map(({ sprites: { front_default: sprite }, name }) => {
            return { sprite, name };
        })
        return types;
    }

    render() {
        return (
            <>
                <div className="poke-calendar">
                    <div className="flex-container space-between">
                        <div onClick={this.previousMonth} className='fa fa-chevron-left '></div>
                        <div className="flex-container">
                            <div className="monthName">{this.state.date.format('MMMM ')} {this.state.date.format('YYYY ')}</div>
                            <div className="type">{this.state.currentType}</div>
                        </div>
                        <div onClick={this.nextMonth} className='fa fa-chevron-right'></div>
                    </div>
                    <div className='flex-container'>
                        <div className='week-days flex-container flex-center '>S</div>
                        <div className='week-days flex-container flex-center '>M</div>
                        <div className='week-days flex-container flex-center '>T</div>
                        <div className='week-days flex-container flex-center '>W</div>
                        <div className='week-days flex-container flex-center '>T</div>
                        <div className='week-days flex-container flex-center '>F</div>
                        <div className='week-days flex-container flex-center '>S</div>
                    </div>
                    <div className="flex-container flex-wrap">
                        {this.state.daysArr && this.state.daysArr.map((v, i) => {
                            return <div key={i} className='calendar-days flex-container flex-center pos-rel'>
                                {v &&
                                    <>
                                        <div className="flex-container flex-center flex-col">
                                            <div className="date-day">{v.sprite && v.day}</div>
                                            {v.sprite && <img className="small-img" alt="pokemon sprite" src={v.sprite} />}
                                            <div className="small-txt flex-container flex-wrap">{v.name}</div>
                                        </div>
                                    </>
                                }
                            </div>
                        })}
                    </div>
                </div>
            </>
        )
    }
}
export default PokeCalendar;