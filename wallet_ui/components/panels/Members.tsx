import React, {useState, useEffect} from "react";
import { Principal } from "@dfinity/principal";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Typography, Button} from "@material-ui/core";
import { Stack, Tooltip } from "@mui/material";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { EventList } from "../routes/Dashboard";;

const useStyles = makeStyles({
  button: {
    flexGrow: 3,
    minHeight: "35px",
    marginBottom: "10px",
    margin: "5px",
  },
});

interface Props {
  canisters?: EventList["canisters"];
}

async function getMembers() {
  return new Promise<Principal[]>((resolve) => {
    resolve([
      Principal.fromText('xifbj-tqaaa-aaaaa-aaauq-cai'),
      Principal.fromText('esi3v-4kugl-tqyfc-q2d6m-4evtv-yotrw-qxc2u-rzsbg-ctabs-tdhmz-6ae')
    ])
  });
}

function Members() {
  const [ members, setMembers] = useState<Principal[]>([]);
  const [membersList, setList ] = useState<object[]>([
    {
      id : 1,
      name: "",
      date_created: "",
    }
  ]);
  const classes = useStyles();
  const [editable, enableEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [controller, setController] = useState("");

  useEffect(() => {
    console.log('hello');
    getMembers().then(result => {
      setMembers(result);
    }).catch(e => console.error(e));
  }, [])

  return (
    <div className="members">
      <div id="controllersTop"style={{display: "flex", flexWrap: "wrap"}}>
        <Typography
          component="h2"
          variant="h5"
          gutterBottom
          style={{ fontWeight: "bold", display: "inline-block", marginRight: "auto", alignSelf: "center", paddingRight: "60px"}}
        >
          Members
        </Typography>
        <Button variant="contained" color="secondary"
          style={{minWidth: "85px", margin: "5px", flexGrow: 1, maxWidth: "250px"}}
          onClick={() => console.log("pretend to redirect")}>
          Manage
        </Button>
      </div>
      <Typography component="p" style={{marginBottom: "30px"}}>
        Users that have access & charge of canisters with cycles
      </Typography>

      <Stack direction="row" id="membersList" style={{margin: "10px 0"}}>
        {members.map((member, ind) => (
          <Tooltip key={ind} title={member.toText()}>
            <AccountCircleIcon key={ind} color="primary" fontSize="large"/>
          </Tooltip>
          ))}
      </Stack>
    </div>
  )
}

export default Members;