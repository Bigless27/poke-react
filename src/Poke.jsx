import { useState, useEffect } from 'react'
import "./Poke.css"
import "./App.css"
import * as dayjs from 'dayjs'

const PokeCalendar = () => {
    const [date, setDate] = useState(dayjs());
    const [daysArr, setDaysArr] = useState(null);
    const [pokemonArr, setPokemonArr] = useState([]);
    const [typeArr, setTypeArr] = useState([]);

    useEffect(async () => {
        // 893 pokemon
        const promises = new Array(600)
            .fill()
            .map(async (v, i) => await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`));
        var resolved = await Promise.all(promises);
        var data = await Promise.all(resolved.map(res => res.json()));
        setPokemonArr(data);
        return () => {

        }
    }, [])

    useEffect(() => {
        filterArr(date.daysInMonth(), 'fire');
        createCalendar(date)
        return () => {

        }
    }, [pokemonArr])

    const createCalendar = (month) => {
        let firstDay = dayjs(month).startOf('M');
        let days = Array.apply(null, { length: month.daysInMonth() })
            .map(Number.call, Number)
            .map(n => {
                return dayjs(firstDay).add(n, 'd');
            });
        for (let n = 0; n < firstDay.day(); n++) {
            days.unshift(null);
        }
        setDaysArr(days);
    }

    const nextMonth = () => {
        setDate(date.add(1, 'M'));
        createCalendar(date);
    }

    const previousMonth = () => {
        setDate(date.subtract(1, 'M'));
        createCalendar(date);
    }


    const filterArr = (days, type) => {
        var typePokemonArr = pokemonArr.filter((poke) => {
            let types = poke.types.map(({ type }) => type.name);
            return ~types.indexOf(type)
        })
        var types = typePokemonArr.map(({ sprites: { front_default: sprite }, name }) => {
            return { sprite, name };
        })
        return setTypeArr(types);
    }

    return (
        <>

            <div className="poke-calendar">
                <div className="flex-container space-between">
                    <div onClick={previousMonth} className='fa fa-chevron-left '></div>
                    <div>{date.format('MMMM ')} {date.format('YYYY ')}</div>
                    <div onClick={nextMonth} className='fa fa-chevron-right'></div>
                </div>
                <div className='flex-container '>
                    <div className='calendar-days flex-container flex-center '>S</div>
                    <div className='calendar-days flex-container flex-center '>M</div>
                    <div className='calendar-days flex-container flex-center '>T</div>
                    <div className='calendar-days flex-container flex-center '>W</div>
                    <div className='calendar-days flex-container flex-center '>T</div>
                    <div className='calendar-days flex-container flex-center '>F</div>
                    <div className='calendar-days flex-container flex-center '>S</div>
                </div>
                <div className="flex-container flex-wrap">
                    {daysArr && daysArr.map((v, i) => {
                        return <div key={i} className='calendar-days flex-container flex-center '>
                            {v && v.date()}
                            <div class="small-txt">{typeArr.length && typeArr[i].name}</div>
                            <img class="small-img" src={typeArr.length && typeArr[i].sprite} />
                        </div>
                    })}
                </div>
            </div>

        </>
    )
}

export default PokeCalendar;