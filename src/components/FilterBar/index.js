/* eslint-disable react/jsx-key */
import React from "react";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useStyles } from "./styles.js";

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

function FilterBar() {
  const classes = useStyles();
  const numbers = [1];
  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <image
                width='50'
                height='50'
                src='https://images.godsunchained.com/misc/gu-sigel.png'
                alt='NFT Connect'
              />
            </Grid>
            <Grid item xs={10} sx={{ mt: 1 }}>
              <Typography variant='h4'>Collection Name</Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ mt: 1, mb: 5 }} />
        {numbers.map((number, i) => {
          return (
            <Box sx={{ mt: 2 }} key={i}>
              <Box>
                <Stack spacing={3}>
                  <Autocomplete
                    multiple
                    id='tags-outlined'
                    options={SearchNFTs}
                    getOptionLabel={(option) => option.label}
                    // defaultValue={[SearchNFTs[2]]}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Color'
                        placeholder={"Attributes"}
                      />
                    )}
                  />
                </Stack>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Autocomplete
                  multiple
                  id='checkboxes-tags-demo'
                  options={SearchNFTs1}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  // defaultValue={[SearchNFTs1[2]]}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Body'
                      placeholder='Attributes'
                    />
                  )}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
}

export default FilterBar;

const SearchNFTs = [
  { label: "RED", value: 1 },
  { label: "BLUE", value: 2 },
  { label: "BLACK", value: 3 },
];
const SearchNFTs1 = [
  { label: "Slim", value: 1 },
  { label: "Normal", value: 2 },
  { label: "Healthy", value: 3 },
];
