import React, {Component} from 'react';
import fetchJsonp from 'fetch-jsonp';
import Suggestions from './Suggestions';
import './App.css';

const API_URL =
    'http://suggestqueries.google.com/complete/search?client=youtube&q=';

class Search extends Component {
    state = {
        query: '',
        results: []
    };


    debounce = (callback, time) => {
            let interval;
            return () => {
                clearTimeout(interval);
                interval = setTimeout(() => {
                    interval = null;
                    callback();
                }, time);
            };
    }

    getInfo = () => {
        fetchJsonp(`${API_URL} + ${this.state.query}`)
            .then(function(response) {
                return response.json();
            })
            .then(json => {
                const fetchedData = json[1];
                const suggestions = [];
                fetchedData.forEach(element => {
                    suggestions.push(element[0]);
                });
                this.setState({
                    results: suggestions
                });
            })
            .catch(function(ex) {
                console.log('parsing failed', ex);
            });
    };

    handleInputChange = (event) => {
        const debounceGetInfo = this.debounce(this.getInfo, 2000);
        this.setState(
            {
                query: event.target.value
            },
            () => {
                if (this.state.query && this.state.query.length > 1) {
                    debounceGetInfo()
                }
            }
        );
    };

    render() {
        return (
            <form>
                <div className='wrap'>
                    <input
                        className='searchbox'
                        placeholder='Search for...'
                        value={this.state.query}
                        onChange={this.handleInputChange}
                        list='datalist'
                    />
                    <datalist id='datalist'>
                        <Suggestions results={this.state.results} />
                    </datalist>
                </div>
            </form>
        );
    }
}

export default Search;
