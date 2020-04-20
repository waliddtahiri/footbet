import React, { Component } from 'react';
import { Tabs, Tab } from 'react-mdl';
import axios from 'axios';
import './styles.css';
import PostsList from './PostsList'

let allCompetitions = [];
let SA = [];
let Liga = [];
let PL = [];
let BL = [];

class Competitions extends Component {
    constructor(props) {
        super(props);
        this.state = { activeTab: 0, postsSA: [], postsLiga: [], postsPL: [], postsBL: [] };
        this.deleteMatch = this.deleteMatch.bind(this);
        this.updateMatch = this.updateMatch.bind(this);
    }

    async componentDidMount() {
        await axios.get('http://localhost:5000/competitions/all')
            .then(res => {
                allCompetitions.push(...res.data);
            })
        await axios.get(`http://localhost:5000/competitions/${allCompetitions[0]}`)
            .then(res => {
                SA.push(...res.data);
            })
        await axios.get(`http://localhost:5000/competitions/${allCompetitions[1]}`)
            .then(res => {
                Liga.push(...res.data);
            })
        await axios.get(`http://localhost:5000/competitions/${allCompetitions[2]}`)
            .then(res => {
                PL.push(...res.data);
            })
        await axios.get(`http://localhost:5000/competitions/${allCompetitions[3]}`)
            .then(res => {
                BL.push(...res.data);
            })
        this.setState({
            postsSA: SA,
            postsLiga: Liga,
            postsPL: PL,
            postsBL: BL
        })
    }

    toggleCategories() {
        if (this.state.activeTab === 0) {
            return (
                <div className="back"><PostsList posts={this.state.postsSA} deleteMatch={this.deleteMatch} updateMatch={this.updateMatch}/></div>
            )
        }
        if (this.state.activeTab === 1) {
            return (
                <div className="back"><PostsList posts={this.state.postsLiga} deleteMatch={this.deleteMatch} updateMatch={this.updateMatch}/></div>
            )
        }
        if (this.state.activeTab === 2) {
            return (
                <div className="back"><PostsList posts={this.state.postsPL} deleteMatch={this.deleteMatch} updateMatch={this.updateMatch}/></div>
            )
        }
        if (this.state.activeTab === 3) {
            return (
                <div className="back"><PostsList posts={this.state.postsBL} deleteMatch={this.deleteMatch} updateMatch={this.updateMatch}/></div>
            )
        }
    }

    updateMatch(posts, post) {
        let newArray = [];
        if (posts === this.state.postsSA) {
            const postIndex = this.state.postsSA.findIndex(data => data._id === post._id);
            newArray = [
                // destructure all items from beginning to the indexed item
                ...this.state.postsSA.slice(0, postIndex),
                // add the updated item to the array
                post,
                // add the rest of the items to the array from the index after the replaced item
                ...this.state.postsSA.slice(postIndex + 1)
            ]
            this.setState({ postsSA: newArray })
        }
        if (posts === this.state.postsLiga) {
            const postIndex = this.state.postsLiga.findIndex(data => data._id === post._id);
            newArray = [
                // destructure all items from beginning to the indexed item
                ...this.state.postsLiga.slice(0, postIndex),
                // add the updated item to the array
                post,
                // add the rest of the items to the array from the index after the replaced item
                ...this.state.postsLiga.slice(postIndex + 1)
            ]
            this.setState({ postsLiga: newArray })
        }
        if (posts === this.state.postsPL) {
            const postIndex = this.state.postsPL.findIndex(data => data._id === post._id);
            newArray = [
                // destructure all items from beginning to the indexed item
                ...this.state.postsPL.slice(0, postIndex),
                // add the updated item to the array
                post,
                // add the rest of the items to the array from the index after the replaced item
                ...this.state.postsPL.slice(postIndex + 1)
            ]
            this.setState({ postsPL: newArray })
        }
        if (posts === this.state.postsBL) {
            const postIndex = this.state.postsBL.findIndex(data => data._id === post._id);
            newArray = [
                // destructure all items from beginning to the indexed item
                ...this.state.postsBL.slice(0, postIndex),
                // add the updated item to the array
                post,
                // add the rest of the items to the array from the index after the replaced item
                ...this.state.postsBL.slice(postIndex + 1)
            ]
            this.setState({ postsBL: newArray })
        }
    }

    deleteMatch(posts, id) {
        axios.delete('http://localhost:5000/matches/' + id)
        if (posts === this.state.postsSA) {
            const filteredMatchesSA = this.state.postsSA.filter(match => match._id !== id);
            this.setState({
                postsSA: filteredMatchesSA
            })
        }
        if (posts === this.state.postsLiga) {
            const filteredMatchesLiga = this.state.postsLiga.filter(match => match._id !== id);
            this.setState({
                postsLiga: filteredMatchesLiga
            })
        }
        if (posts === this.state.postsPL) {
            const filteredMatchesPL = this.state.postsPL.filter(match => match._id !== id);
            this.setState({
                postsPL: filteredMatchesPL
            })
        }
        if (posts === this.state.postsBL) {
            const filteredMatchesBL = this.state.postsBL.filter(match => match._id !== id);
            this.setState({
                postsBL: filteredMatchesBL
            })
        }
    }

    render() {
        console.log("123")
        return (
            <div className="competitions-tabs">
                <Tabs activeTab={this.state.activeTab} onChange={(tabId) => this.setState({ activeTab: tabId })} ripple>
                    <Tab>Serie A</Tab>
                    <Tab>Liga</Tab>
                    <Tab>Premier League</Tab>
                    <Tab>BundesLiga</Tab>
                    <Tab>Champions League</Tab>
                </Tabs>
                <section className="projects-grid">
                    {this.toggleCategories()}
                </section>
            </div>
        )
    }
}

export default Competitions;