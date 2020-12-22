// Imports

import React from "react";
import { FaHeart } from 'react-icons/fa';
import { loremIpsum } from "lorem-ipsum";

import SheetCard from '../../../cards/sheet-card/sheet-card';
import { Section, FlexRow, Container } from '../../../layouts';
import { Title } from '../../../headers';
import Tabs from '../../../tabs/tabs'

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const sampPara = () => {return loremIpsum({units: "paragraphs", count: 1, sentenceUpperBound: 7, paragraphLowerBound: 3, paragraphUpperBound: 3})}
const sampTitle = () => {return loremIpsum({units: "sentences", count: 1, sentenceLowerBound: 2, sentenceUpperBound: 2})}

// Sheets

const Sheets = () => (
  <Section minHeight={700}>
    <Container bg="primaryBg" flexDirection="column">
      <Title as="h1" variant="large" mt='40px' mb='30px' width="100%" textAlign="center">
        Our Sheets
      </Title>
      <div style={styles}>
        <Tabs activeTab={{id: "tab1"}}>
          <Tabs.Tab id="tab1" title="Produce">
            <FlexRow flexBasis='50%' pl={['5%']} pr={['5%', '5%']} mt={40}>
              <SheetCard icon={[<FaHeart />]} title={sampTitle()} paragraph={sampPara()} link="/login" />
              <SheetCard icon={[<FaHeart />]} title={sampTitle()} paragraph={sampPara()} link="/login" />
              <SheetCard icon={[<FaHeart />]} title={sampTitle()} paragraph={sampPara()} link="/login" />
              <SheetCard icon={[<FaHeart />]} title={sampTitle()} paragraph={sampPara()} link="/login" />
            </FlexRow>
          </Tabs.Tab>
          <Tabs.Tab id="tab2" title="Dispense">
            <FlexRow flexBasis='50%' pl={['5%']} pr={['5%', '5%']} mt={40}>
              <SheetCard icon={[<FaHeart />]} title={sampTitle()} paragraph={sampPara()} link="/login" />
              <SheetCard icon={[<FaHeart />]} title={sampTitle()} paragraph={sampPara()} link="/login" />
              <SheetCard icon={[<FaHeart />]} title={sampTitle()} paragraph={sampPara()} link="/login" />
              <SheetCard icon={[<FaHeart />]} title={sampTitle()} paragraph={sampPara()} link="/login" />
            </FlexRow>
          </Tabs.Tab>
          <Tabs.Tab id="tab3" title="Cultivate">
            <FlexRow flexBasis='50%' pl={['5%']} pr={['5%', '5%']} mt={40}>
              <SheetCard icon={[<FaHeart />]} title={sampTitle()} paragraph={sampPara()} link="/login" />
              <SheetCard icon={[<FaHeart />]} title={sampTitle()} paragraph={sampPara()} link="/login" />
              <SheetCard icon={[<FaHeart />]} title={sampTitle()} paragraph={sampPara()} link="/login" />
              <SheetCard icon={[<FaHeart />]} title={sampTitle()} paragraph={sampPara()} link="/login" />
            </FlexRow>
          </Tabs.Tab>
        </Tabs>
      </div>
    </Container>
  </Section>
);

export default Sheets;