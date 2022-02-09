import React, { useEffect, useState } from 'react';
import { Button, Paper, Stack, Typography } from '@mui/material';
import values from './values.json';

const value = values[Math.floor(Math.random() * values.length)];

function App() {
  const letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
  
  const [selected, setSelected] = useState<{
    letter: string;
    state: string;
    end: boolean;
  }[][]>([
    [],
    [],
    [],
    [],
    [],
    []
  ]);
  const [end, setEnd] = useState(false)
  const [where, setWhere] = useState(0);

  useEffect(() => {
    if(selected[5].find(x => x.end) || selected.find(x => x.filter(x => x.state === 'is').length === value.length)) {
      setEnd(true);
    }
  }, [selected]);

  return (
    <div className="game">
    <Typography variant="h4" mb={3}>ARdle - Custom wordle</Typography>
      <Stack spacing={1} mb={3} sx={{
        display: 'inline-flex'
      }}>
        {selected.map(thingo => <Stack direction="row" spacing={1}>
          {[...thingo, ...Array(value.length - thingo.length)].map(letter => <Paper variant="outlined" sx={{
          width: 50,
          height: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          backgroundColor: letter?.state === 'is' ? '#2e7d32' : letter?.state === 'isDifferent' ? '#ed6c02' : letter?.state === 'isNot' ? '#d32f2f' : '#1976d2'
        }}><Typography fontSize="24px">{letter?.letter}</Typography></Paper>)}
        </Stack>)}
      </Stack>
      <Stack direction="row" flexWrap="wrap" justifyContent="center" spacing={1} gap={1} mb={3}>
        {letters.map(letter => <>
        <Button variant="contained" disabled={end || !(selected[where].length < value.length && !selected[where].find(x => x.letter === letter))} color={([].concat.apply([], selected as any) as {
          letter: string;
          state: string;
          end: boolean;
        }[]).slice().reverse().filter((x, i, a) => a.findIndex(y => y.letter === x.letter) === i).find(x => x.letter === letter)?.state === 'is' ? 'success' : ([].concat.apply([], selected as any) as {
          letter: string;
          state: string;
          end: boolean;
        }[]).slice().reverse().filter((x, i, a) => a.findIndex(y => y.letter === x.letter) === i).find(x => x.letter === letter)?.state === 'isDifferent' ? 'warning' : ([].concat.apply([], selected as any) as {
          letter: string;
          state: string;
          end: boolean;
        }[]).slice().reverse().filter((x, i, a) => a.findIndex(y => y.letter === x.letter) === i).find(x => x.letter === letter)?.state === 'isNot' ? 'error' : 'primary'} onClick={() => {
            setSelected(selected => {
              let newSelected = [...selected];
              newSelected[where].push({
                letter: letter,
                state: 'none',
                end: false
              });
              return newSelected;
            });
        }}>{letter}</Button>
        {letter === 'P' || letter === 'Ñ' ? <div style={{
          flexBasis: '100%'
        }}></div> : null}
        </>)}
        <Button variant="contained" disabled={end} onClick={() => {
          setSelected(selected => {
            let newSelected = [...selected];
            newSelected[where].pop();
            return newSelected;
          });
        }}>←</Button>
        <Button variant="contained" disabled={end} onClick={() => {
          if(selected[where].length > value.length - 1) {
            selected[where].forEach(letter => {
              if(value.includes(letter.letter)) {
                if(value.split('').indexOf(letter.letter) === selected[where].indexOf(letter)) {
                  setSelected(selected => {
                    let newSelected = [...selected];
                    newSelected[where][newSelected[where].findIndex(x => x.letter === letter.letter)].end = true;
                    newSelected[where][newSelected[where].findIndex(x => x.letter === letter.letter)].state = 'is';
                    return newSelected;
                  });
                } else {
                  setSelected(selected => {
                    let newSelected = [...selected];
                    newSelected[where][newSelected[where].findIndex(x => x.letter === letter.letter)].end = true;
                    newSelected[where][newSelected[where].findIndex(x => x.letter === letter.letter)].state = 'isDifferent';
                    return newSelected;
                  });
                }
              } else {
                setSelected(selected => {
                  let newSelected = [...selected];
                  newSelected[where][newSelected[where].findIndex(x => x.letter === letter.letter)].end = true;
                  newSelected[where][newSelected[where].findIndex(x => x.letter === letter.letter)].state = 'isNot';
                  return newSelected;
                });
              }
            });
            setWhere(where + 1);
        }
        }}>Enter</Button>
      </Stack>
      <Button variant="contained" disabled={!end} onClick={() => {
        navigator.clipboard.writeText('ARdle ' + selected.filter(x => x.length > 0).length.toString() + '/6\n' + selected.map(x => [...x, ...Array(value.length - x.length)].map(x => {
          if(x?.state === 'is') {
            return '🟩'
          } else if(x?.state === 'isDifferent') {
            return '🟨'
          } else if (x?.state === 'isNot') {
            return '🟥';
          } else {
            return '⬜';
          }
        }).join('')).join('\n'))
      }}>Copy result</Button>
    </div>
  );
}

export default App;
