import { useReducer, useEffect } from 'react'
import "./Poke.css"
import "./App.css"
import * as dayjs from 'dayjs'
import typeMap from './typeMap';
import { initialState, reducer } from './Pokereducer';
import logger from 'use-reducer-logger';

const PokeCalendar = () => {
    const [state, dispatch] = useReducer(logger(reducer), initialState);

    useEffect(() => {
        // 893 pokemon
        async function sendRequest() {
            const promises = new Array(750)
                .fill()
                .map(async (v, i) => await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`));
            var resolved = await Promise.all(promises);
            var data = await Promise.all(resolved.map(res => res.json()));
            dispatch({ type: 'UPDATE', payload: { pokemonArr: data } });
        }
        sendRequest();
        return () => {

        }
    }, []);

    useEffect(() => {
        createCalendar(state.date);
    }, [state.pokemonArr])

    const appendPokemon = (daysArr) => {
        if (!daysArr) return;
        const filteredState = filterArr(typeMap[state.date.month()])
        dispatch({ type: 'UPDATE', payload: { typeArr: filteredState } });
        let newDays = daysArr.map((day, i) => {
            if (day) {
                return { day: day.date(), ...filteredState[i] };
            }
            return day;
        })
        return newDays;
    }


    const createCalendar = (month) => {
        let firstDay = dayjs(month).startOf('M');
        dispatch({ type: 'UPDATE', payload: { currentType: typeMap[state.date.month()] } })
        let days = Array.apply(null, { length: month.daysInMonth() })
            .map(Number.call, Number)
            .map(n => {
                return dayjs(firstDay).add(n, 'd');
            })

        for (let n = 0; n < firstDay.day(); n++) {
            days.unshift(null);
        }

        days = appendPokemon(days);
        dispatch({ type: 'UPDATE', payload: { daysArr: days } })
    }

    const nextMonth = () => {
        const newMonth = state.date.add(1, 'M');
        dispatch({ type: 'UPDATE', payload: { date: newMonth, currentType: typeMap[newMonth.month()] } });
        createCalendar(newMonth);
    }

    const previousMonth = () => {
        const newMonth = state.date.subtract(1, 'M');
        dispatch({ type: 'UPDATE', payload: { date: newMonth, currentType: typeMap[newMonth.month()] } });
        createCalendar(newMonth);
    }

    const filterArr = (type) => {
        var typePokemonArr = state.pokemonArr.filter((poke) => {
            let types = poke.types.map(({ type }) => type.name);
            return ~types.indexOf(type)
        })
        var types = typePokemonArr.map(({ sprites: { front_default: sprite }, name }) => {
            return { sprite, name };
        })
        return types;
    }

    return (
        <>
            <div className="poke-calendar">
                <div className="flex-container space-between">
                    <div onClick={previousMonth} className='fa fa-chevron-left '></div>
                    <div>
                        <div>{state.date.format('MMMM ')} {state.date.format('YYYY ')}</div>
                        <div>{state.currentType}</div>
                    </div>
                    <div onClick={nextMonth} className='fa fa-chevron-right'></div>
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
                    {state.daysArr && state.daysArr.map((v, i) => {
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

export default PokeCalendar;